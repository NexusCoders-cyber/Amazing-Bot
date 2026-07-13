import './src/utils/loadEnv.js';
import P from 'pino';
import express from 'express';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import readline from 'readline/promises';
import NodeCache from 'node-cache';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import { connectToDatabase } from './src/utils/database.js';
import logger from './src/utils/logger.js';
import { messageHandler } from './src/handlers/messageHandler.js';
import { commandHandler } from './src/handlers/commandHandler.js';
import eventHandler from './src/handlers/eventHandler.js';
import callHandler from './src/handlers/callHandler.js';
import groupHandler from './src/handlers/groupHandler.js';
import errorHandler from './src/handlers/errorHandler.js';
import config from './src/config.js';
import constants from './src/constants.js';
import { loadPlugins, getActiveCount } from './src/utils/pluginManager.js';
import { startScheduler } from './src/utils/scheduler.js';
import { initializeCache } from './src/utils/cache.js';
import { startWebServer } from './src/utils/webServer.js';
import { enableAutoTranslate } from './src/utils/translator.js';
import qrService from './src/services/qrService.js';
import Settings from './src/models/Settings.js';
import { startTelegramPairBot } from './src/services/telegramPairBot.js';
import { setPairingSessionSocketHandler, startSavedPairedSessions } from './src/services/pairingService.js';
import { BOT_CHANNEL_JID } from './src/utils/botChannel.js';

global._config = config;

const msgRetryCounterCache = new NodeCache({ stdTTL: 600, checkperiod: 60 });
const app = express();
let sock = null;
let isShuttingDown = false;
let connectionTimeout = null;
let reconnectAttempts = 0;
let reconnectTimer = null;
let reconnectInProgress = false;
let cachedPairingNumber = null;
let telegramBotController = null;
let generatedSessionSaved = false;
let pairedSessionDeployTimer = null;
let lastLoggedOutAt = 0;
const pairedRuntimeSockets = new WeakSet();

const SESSION_PATH = process.env.SESSION_AUTH_DIR || path.join(process.cwd(), 'cache', 'auth_info_baileys');
const GENERATED_SESSION_FILE = path.join(process.cwd(), 'data', 'generated_session_id.txt');
const MAX_RECONNECT = 10;
const RECONNECT_DELAYS = [3000, 5000, 10000, 15000, 20000, 30000, 30000, 30000, 30000, 30000];
const NEWSLETTER_CHANNELS = [BOT_CHANNEL_JID];

function shouldUsePairingCodeFlow() {
    return String(process.env.DISABLE_PAIRING_CODE_FLOW || '').toLowerCase() !== 'true';
}

function getSessionIdentifier() {
    const raw = (
        process.env.SESSION_ID ||
        process.env.SESSIONID ||
        process.env.SESSION ||
        process.env.WA_SESSION_ID ||
        process.env.ILOMBOT_SESSION_ID ||
        process.env.SESSION_CREDS_JSON ||
        process.env.CREDS_JSON ||
        config.session?.sessionId ||
        ''
    );
    return String(raw || '')
        .trim()
        .replace(/^['"`]|['"`]$/g, '')
        .replace(/^SESSION_ID\s*=\s*/i, '')
        .trim();
}

async function getSessionIdFromEnvFile() {
    const envPath = path.join(process.cwd(), '.env');
    if (!await fs.pathExists(envPath)) return '';
    const lines = (await fs.readFile(envPath, 'utf8')).split(/\r?\n/);
    for (const rawLine of lines) {
        const line = String(rawLine || '').trim();
        if (!line || line.startsWith('#') || !line.includes('=')) continue;
        const key = line.slice(0, line.indexOf('=')).trim();
        if (key !== 'SESSION_ID') continue;
        const value = line.slice(line.indexOf('=') + 1).trim().replace(/^['"`]|['"`]$/g, '').replace(/^SESSION_ID\s*=\s*/i, '').trim();
        if (value) return value;
    }
    return '';
}

function escapeEnvValue(value = '') {
    return String(value ?? '').replace(/\r?\n/g, '\\n');
}

async function setEnvValue(key, value) {
    const envPath = path.join(process.cwd(), '.env');
    const nextLine = `${key}=${escapeEnvValue(value)}`;
    let content = '';
    if (await fs.pathExists(envPath)) content = await fs.readFile(envPath, 'utf8');
    const lines = content ? content.split(/\r?\n/) : [];
    let updated = false;
    const mapped = lines.map((line) => {
        if (!line.trim().startsWith('#') && line.includes('=')) {
            const name = line.slice(0, line.indexOf('=')).trim();
            if (name === key) { updated = true; return nextLine; }
        }
        return line;
    });
    if (!updated) mapped.push(nextLine);
    await fs.writeFile(envPath, `${mapped.join('\n').replace(/\n+$/g, '')}\n`, 'utf8');
    process.env[key] = String(value ?? '');
}

async function removeEnvValue(key) {
    const envPath = path.join(process.cwd(), '.env');
    if (!await fs.pathExists(envPath)) return;
    const lines = (await fs.readFile(envPath, 'utf8')).split(/\r?\n/);
    const filtered = lines.filter((line) => {
        if (line.trim().startsWith('#') || !line.includes('=')) return true;
        return line.slice(0, line.indexOf('=')).trim() !== key;
    });
    await fs.writeFile(envPath, `${filtered.join('\n').replace(/\n+$/g, '')}\n`, 'utf8');
    delete process.env[key];
}

async function buildSessionIdFromLocalAuth() {
    const credsPath = path.join(SESSION_PATH, 'creds.json');
    const keysPath = path.join(SESSION_PATH, 'keys');
    if (!await fs.pathExists(credsPath)) return '';
    const creds = await fs.readJSON(credsPath).catch(() => null);
    if (!creds || typeof creds !== 'object') return '';
    const keys = {};
    if (await fs.pathExists(keysPath)) {
        const files = await fs.readdir(keysPath).catch(() => []);
        for (const fileName of files) {
            if (!fileName.endsWith('.json')) continue;
            const keyData = await fs.readJSON(path.join(keysPath, fileName)).catch(() => null);
            if (keyData && typeof keyData === 'object') keys[fileName.replace(/\.json$/i, '')] = keyData;
        }
    }
    return `Ilom~${Buffer.from(JSON.stringify({ creds, keys })).toString('base64')}`;
}

async function persistGeneratedSessionId(sessionId) {
    if (!sessionId) return false;
    await fs.ensureDir(path.dirname(GENERATED_SESSION_FILE));
    await fs.writeFile(GENERATED_SESSION_FILE, `${sessionId}\n`, 'utf8');
    await setEnvValue('SESSION_ID', sessionId);
    await removeEnvValue('SESSION_CREDS_JSON');
    return true;
}

async function clearLocalAuthFiles() {
    await fs.remove(path.join(SESSION_PATH, 'creds.json')).catch(() => {});
    await fs.emptyDir(path.join(SESSION_PATH, 'keys')).catch(() => {});
}

async function hasUsableLocalAuthSession() {
    const credsPath = path.join(SESSION_PATH, 'creds.json');
    if (!await fs.pathExists(credsPath)) return false;
    try {
        const creds = await fs.readJSON(credsPath);
        return Boolean(creds?.registered && creds?.me?.id);
    } catch { return false; }
}

async function downloadFromMega(fullMegaUrl) {
    const { File } = await import('megajs');
    return new Promise((resolve, reject) => {
        let file;
        try { file = File.fromURL(fullMegaUrl); }
        catch (e) { return reject(new Error(`Mega URL parse failed: ${e.message}`)); }
        file.loadAttributes((err) => {
            if (err) return reject(new Error(`Mega loadAttributes failed: ${err.message}`));
            const chunks = [];
            const stream = file.download();
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('end', () => resolve(Buffer.concat(chunks)));
            stream.on('error', e => reject(new Error(`Mega stream failed: ${e.message}`)));
        });
    });
}

async function processSessionCredentials() {
    await fs.ensureDir(SESSION_PATH);
    await fs.ensureDir(path.join(SESSION_PATH, 'keys'));
    const credPath = path.join(SESSION_PATH, 'creds.json');
    const keysPath = path.join(SESSION_PATH, 'keys');
    const sessionId = getSessionIdentifier();
    const localSessionAvailable = await hasUsableLocalAuthSession();

    if (localSessionAvailable) {
        logger.info('Local auth session found — skipping SESSION_ID import');
        return true;
    }

    if (!sessionId) {
        logger.info('No SESSION_ID — QR/pairing mode');
        return false;
    }

    try {
        logger.info('Processing session credentials...');

        const persistSessionData = async (rawData) => {
            await fs.remove(credPath).catch(() => {});
            await fs.emptyDir(keysPath);

            if (Buffer.isBuffer(rawData) && rawData.length > 4 && rawData[0] === 0x50 && rawData[1] === 0x4b) {
                try {
                    const unzipper = await import('unzipper');
                    const zip = await unzipper.Open.buffer(rawData);
                    for (const entry of zip.files) {
                        if (entry.type !== 'File') continue;
                        const safePath = path.normalize(entry.path).replace(/^(\.\.(\/|\\|$))+/, '');
                        const target = path.join(SESSION_PATH, safePath);
                        await fs.ensureDir(path.dirname(target));
                        await fs.writeFile(target, await entry.buffer());
                    }
                    const rootCreds = path.join(SESSION_PATH, 'creds.json');
                    if (!await fs.pathExists(rootCreds)) {
                        const nestedCreds = path.join(SESSION_PATH, 'auth_info_baileys', 'creds.json');
                        if (await fs.pathExists(nestedCreds)) await fs.copy(nestedCreds, rootCreds, { overwrite: true });
                    }
                    return await fs.pathExists(rootCreds);
                } catch (zipErr) {
                    logger.warn(`Zip extraction failed: ${zipErr.message}`);
                }
            }

            let parsed = rawData;
            if (Buffer.isBuffer(parsed)) {
                const asText = parsed.toString('utf8').replace(/^\uFEFF/, '').trim();
                try { parsed = JSON.parse(asText); }
                catch {
                    try { parsed = JSON.parse(Buffer.from(asText, 'base64').toString('utf8')); }
                    catch {
                        const firstBrace = asText.indexOf('{');
                        const lastBrace = asText.lastIndexOf('}');
                        if (firstBrace !== -1 && lastBrace > firstBrace) {
                            try { parsed = JSON.parse(asText.slice(firstBrace, lastBrace + 1)); }
                            catch { parsed = null; }
                        } else { parsed = null; }
                    }
                }
            }
            if (typeof parsed === 'string') { try { parsed = JSON.parse(parsed); } catch {} }

            if (parsed?.creds && typeof parsed.creds === 'object') {
                await fs.writeJSON(credPath, parsed.creds, { spaces: 2 });
                if (parsed.keys && typeof parsed.keys === 'object') {
                    for (const [keyName, keyData] of Object.entries(parsed.keys)) {
                        if (keyData && typeof keyData === 'object') {
                            await fs.writeJSON(path.join(keysPath, `${keyName}.json`), keyData, { spaces: 2 });
                        }
                    }
                }
                return true;
            }

            if (parsed?.noiseKey || parsed?.signedIdentityKey) {
                await fs.writeJSON(credPath, parsed, { spaces: 2 });
                return true;
            }

            if (Buffer.isBuffer(rawData)) {
                await fs.writeFile(credPath, rawData);
                try {
                    const saved = await fs.readJSON(credPath);
                    return !!(saved?.noiseKey || saved?.signedIdentityKey || saved?.creds);
                } catch { return false; }
            }

            return false;
        };

        const normalizedSessionId = String(sessionId || '').trim();
        const lowerSessionId = normalizedSessionId.toLowerCase();

        if (
            lowerSessionId.startsWith('ilombot--') ||
            lowerSessionId.startsWith('ilombot ilombot--') ||
            /^https:\/\/mega\.nz\/(file|folder)\//i.test(normalizedSessionId)
        ) {
            const encoded = normalizedSessionId
                .replace(/^(?:ilombot\s+)?ilombot--/i, '')
                .trim()
                .replace(/\s+/g, '');

            let fullMegaUrl;
            try {
                const normalized = encoded
                    .replace(/-/g, '+')
                    .replace(/_/g, '/')
                    .padEnd(Math.ceil(encoded.length / 4) * 4, '=');
                fullMegaUrl = Buffer.from(normalized, 'base64').toString('utf8').trim();
                if (!/^https:\/\/mega\.nz\/(file|folder)\//.test(fullMegaUrl)) {
                    throw new Error('Not a Mega URL');
                }
            } catch {
                fullMegaUrl = null;
            }

            if (/^https:\/\/mega\.nz\/(file|folder)\//.test(sessionId)) fullMegaUrl = sessionId;

            let fileData;
            if (fullMegaUrl) {
                try {
                    fileData = await downloadFromMega(fullMegaUrl);
                } catch (megaErr) {
                    logger.warn(`Mega download failed: ${megaErr.message}`);
                    const axios = (await import('axios')).default;
                    const fileIdOnly = fullMegaUrl.replace('https://mega.nz/file/', '').split('#')[0];
                    const response = await axios.get(
                        `https://existing-madelle-lance-ui-efecfdce.koyeb.app/download/${fileIdOnly}`,
                        { responseType: 'arraybuffer', timeout: 30000 }
                    );
                    fileData = Buffer.from(response.data);
                }
            } else {
                const axios = (await import('axios')).default;
                const response = await axios.get(
                    `https://existing-madelle-lance-ui-efecfdce.koyeb.app/download/${encoded}`,
                    { responseType: 'arraybuffer', timeout: 30000 }
                );
                fileData = Buffer.from(response.data);
            }

            const persisted = await persistSessionData(fileData);
            if (!persisted) {
                await fs.remove(path.join(SESSION_PATH, 'creds.json')).catch(() => {});
                throw new Error('Downloaded session file is invalid');
            }
            logger.info('Session loaded from ilombot-- format');
            return true;
        }

        let sessionData;
        if (sessionId.startsWith('Ilom~')) {
            sessionData = JSON.parse(Buffer.from(sessionId.replace('Ilom~', ''), 'base64').toString());
        } else if (sessionId.startsWith('{')) {
            sessionData = JSON.parse(sessionId);
        } else {
            try { sessionData = JSON.parse(Buffer.from(sessionId, 'base64').toString()); }
            catch { sessionData = JSON.parse(sessionId); }
        }

        if (sessionData?.creds) {
            await fs.writeJSON(path.join(SESSION_PATH, 'creds.json'), sessionData.creds, { spaces: 2 });
            if (sessionData.keys && typeof sessionData.keys === 'object') {
                for (const [keyName, keyData] of Object.entries(sessionData.keys)) {
                    if (keyData && typeof keyData === 'object') {
                        await fs.writeJSON(path.join(keysPath, `${keyName}.json`), keyData, { spaces: 2 });
                    }
                }
            }
        } else {
            await fs.writeJSON(path.join(SESSION_PATH, 'creds.json'), sessionData, { spaces: 2 });
        }

        logger.info('Session credentials processed');
        return true;
    } catch (error) {
        if (await hasUsableLocalAuthSession()) {
            logger.warn(`Session processing failed (${error.message}) — using local session`);
            return true;
        }
        logger.warn(`Session processing failed: ${error.message} — QR mode`);
        await fs.remove(path.join(SESSION_PATH, 'creds.json')).catch(() => {});
        await removeEnvValue('SESSION_ID').catch(() => {});
        return false;
    }
}

async function sendBotStatusUpdate(sock) {
    const now = new Date().toLocaleString('en-US', {
        timeZone: config.timezone || 'UTC',
        weekday: 'long', year: 'numeric', month: 'long',
        day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const text = `${config.botName} is Online\n\nStarted: ${now}\nMode: ${config.publicMode ? 'Public' : 'Private'}\nPrefix: ${config.prefix}\nCommands: ${commandHandler.getCommandCount()}\nPlugins: ${getActiveCount()}\n\nType ${config.prefix}help to see all commands`;
    for (const owner of config.ownerNumbers) {
        try { await sock.sendMessage(owner, { text }); } catch {}
    }
}

async function setupEventHandlers(sock, saveCreds) {
    sock.ev.on('creds.update', async () => { await saveCreds(); });
    await messageHandler.initializeCommandHandler();
    if (pairedRuntimeSockets.has(sock)) return;
    pairedRuntimeSockets.add(sock);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        if (!messages?.length) return;
        for (const message of messages) {
            try {
                if (!message?.key) continue;
                const from = message.key.remoteJid;
                if (!from || from === 'status@broadcast') continue;
                const ownJid = sock?.user?.id ? sock.user.id.split(':')[0] : '';
                const isOwnChat = ownJid && from === ownJid;
                if (message.key.fromMe && !config.selfMode && !isOwnChat) continue;
                if (!message.message || !Object.keys(message.message).length) continue;
                const ignoredTypes = ['protocolMessage', 'senderKeyDistributionMessage', 'messageContextInfo'];
                const hasContent = Object.keys(message.message).some(k => !ignoredTypes.includes(k));
                if (!hasContent) continue;
                await messageHandler.handleIncomingMessage(sock, message);
            } catch (error) {
                logger.error('Error processing message:', error);
            }
        }
    });

    sock.ev.on('messages.update', async (updates) => {
        if (config.events?.messageUpdate) await messageHandler.handleMessageUpdate(sock, updates);
    });

    sock.ev.on('messages.delete', async (payload) => {
        if (!config.events?.messageDelete) return;
        const keys = Array.isArray(payload) ? payload : (Array.isArray(payload?.keys) ? payload.keys : []);
        if (!keys.length) return;
        await messageHandler.handleMessageDelete(sock, keys);
    });

    sock.ev.on('group-participants.update', async (update) => {
        try { await groupHandler.handleParticipantsUpdate(sock, update); }
        catch (error) { logger.error('Group participants update error:', error); }
    });

    sock.ev.on('groups.update', async (updates) => {
        try { await groupHandler.handleGroupUpdate(sock, updates); }
        catch (error) { logger.error('Groups update error:', error); }
    });

    sock.ev.on('call', async (calls) => {
        await callHandler.handleIncomingCall(sock, calls);
    });

    setInterval(() => {
        if (sock?.user && !isShuttingDown) sock.sendPresenceUpdate('available').catch(() => {});
    }, 60000);

    logger.info('Event handlers registered');
}

async function attachPairedSessionRuntime({ sock: pairedSock, sessionId, number }) {
    if (!pairedSock || pairedRuntimeSockets.has(pairedSock)) return;
    await setupEventHandlers(pairedSock, async () => {});
    pairedRuntimeSockets.add(pairedSock);
    logger.info(`Paired session attached: ${sessionId} (+${number || 'unknown'})`);
}

async function promptPairingNumber() {
    if (cachedPairingNumber) return cachedPairingNumber;
    const envNumber = (process.env.PAIRING_NUMBER || process.env.PHONE_NUMBER || '').replace(/\D/g, '');

    if (envNumber.length >= 10) { cachedPairingNumber = envNumber; return cachedPairingNumber; }

    const isTTY = process.stdin.isTTY === true;
    const noConsoleInput = String(process.env.NO_CONSOLE_INPUT || '').toLowerCase() === 'true';
    const canPrompt = isTTY && !noConsoleInput;

    if (canPrompt) {
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        try {
            console.log(chalk.cyan('\n  Pairing Mode — Enter your WhatsApp number (with country code):\n'));
            const answer = await Promise.race([
                rl.question('  Number: '),
                new Promise((_, reject) => setTimeout(() => reject(new Error('prompt_timeout')), 60000))
            ]);
            const normalized = String(answer || '').replace(/\D/g, '');
            if (normalized.length >= 10) { cachedPairingNumber = normalized; return normalized; }
        } catch {
        } finally { rl.close(); }
    }

    return null;
}

async function requestPairingCodeIfNeeded(sock, isRegistered) {
    if (isRegistered) return;
    const sessionFromEnvFile = await getSessionIdFromEnvFile();
    const sessionFromRuntimeEnv = String(process.env.SESSION_ID || '').trim();
    if (sessionFromEnvFile || sessionFromRuntimeEnv) return;
    const number = await promptPairingNumber();
    if (!number) return;
    try {
        const rawCode = await sock.requestPairingCode(number);
        const code = rawCode?.match(/.{1,4}/g)?.join('-') || rawCode;
        console.log(chalk.green(`\n  Pairing Code: ${chalk.bold(code)}\n`));
        console.log(chalk.gray('  WhatsApp > Linked Devices > Link with phone number > Enter code above\n'));
    } catch (error) {
        logger.warn(`Pairing code failed: ${error.message}`);
    }
}

async function establishWhatsAppConnection() {
    return new Promise(async (resolve, reject) => {
        try {
            reconnectInProgress = false;
            if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }

            const { makeWASocket, Browsers, useMultiFileAuthState, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, DisconnectReason } = await import('@whiskeysockets/baileys');
            const { state, saveCreds } = await useMultiFileAuthState(SESSION_PATH);
            const { version } = await fetchLatestBaileysVersion();
            let pairingRequested = false;

            logger.info(`Connecting — Baileys v${version.join('.')}`);

            const browserProfile = typeof Browsers?.ubuntu === 'function'
                ? Browsers.ubuntu('Chrome')
                : Browsers.macOS('Chrome');

            sock = makeWASocket({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, P({ level: 'fatal' }).child({ level: 'fatal' }))
                },
                printQRInTerminal: false,
                browser: browserProfile,
                markOnlineOnConnect: config.autoOnline !== false,
                syncFullHistory: false,
                defaultQueryTimeoutMs: undefined,
                connectTimeoutMs: 180000,
                keepAliveIntervalMs: 25000,
                retryRequestDelayMs: 250,
                generateHighQualityLinkPreview: false,
                logger: P({ level: 'silent' }),
                version,
                getMessage: async () => ({ conversation: '' })
            });

            if (connectionTimeout) clearTimeout(connectionTimeout);
            connectionTimeout = setTimeout(() => {
                if (!sock?.user) { logger.warn('Connection timeout — retrying'); handleReconnect(resolve, reject); }
            }, 120000);

            sock.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
                if (connection === 'connecting' && !state.creds?.registered && !pairingRequested && shouldUsePairingCodeFlow()) {
                    pairingRequested = true;
                    setTimeout(() => requestPairingCodeIfNeeded(sock, false).catch(() => {}), 2000);
                }

                if (connection === 'open') {
                    clearTimeout(connectionTimeout);
                    connectionTimeout = null;
                    reconnectAttempts = 0;
                    reconnectInProgress = false;
                    lastLoggedOutAt = 0;

                    console.log(chalk.green('  WhatsApp connected'));
                    if (qrService.isQREnabled()) await qrService.clearQR().catch(() => {});
                    await setupEventHandlers(sock, saveCreds);
                    global.sock = sock;
                    try { enableAutoTranslate(sock); } catch {}
                    await sendBotStatusUpdate(sock).catch(() => {});
                    await autoFollowNewsletters(sock).catch(() => {});

                    if (!getSessionIdentifier() && !generatedSessionSaved) {
                        try {
                            const generated = await buildSessionIdFromLocalAuth();
                            if (generated) {
                                await persistGeneratedSessionId(generated);
                                generatedSessionSaved = true;
                                logger.info('Session saved to data/generated_session_id.txt');
                            }
                        } catch (saveErr) {
                            logger.warn(`Failed to save session id: ${saveErr.message}`);
                        }
                    }

                    resolve(sock);
                }

                if (connection === 'close') {
                    if (connectionTimeout) { clearTimeout(connectionTimeout); connectionTimeout = null; }
                    if (isShuttingDown) return resolve(null);

                    const statusCode = lastDisconnect?.error?.output?.statusCode;
                    logger.warn(`Connection closed — code: ${statusCode}`);

                    const sessionWasLoggedOut = statusCode === DisconnectReason.loggedOut;
                    const badSessionDetected = statusCode === DisconnectReason.badSession;

                    if (sessionWasLoggedOut) {
                        const now = Date.now();
                        const repeatedLoggedOut = now - lastLoggedOutAt < 120000;
                        lastLoggedOutAt = now;
                        if (repeatedLoggedOut) {
                            logger.warn('Repeated logout — clearing auth for new pair');
                            generatedSessionSaved = false;
                            await clearLocalAuthFiles();
                            if (getSessionIdentifier()) {
                                await removeEnvValue('SESSION_ID').catch(() => {});
                            }
                        }
                    }

                    try {
                        sock?.ev?.removeAllListeners?.('connection.update');
                        sock?.ev?.removeAllListeners?.('creds.update');
                        sock?.ws?.close?.();
                        sock?.end?.(lastDisconnect?.error || new Error(`connection_closed_${statusCode || 'unknown'}`));
                    } catch {}
                    sock = null;
                    global.sock = null;

                    console.log(chalk.yellow(`\n  Disconnected (${statusCode}) — reconnecting...\n`));
                    handleReconnect(resolve, reject);
                }
            });

        } catch (error) {
            logger.error('Connection setup failed:', error);
            handleReconnect(resolve, reject);
        }
    });
}

function handleReconnect(resolve, reject) {
    if (isShuttingDown) return resolve(null);
    if (reconnectInProgress) return;
    if (reconnectAttempts >= MAX_RECONNECT) reconnectAttempts = MAX_RECONNECT - 1;
    const delay = RECONNECT_DELAYS[reconnectAttempts] || 30000;
    reconnectAttempts++;
    reconnectInProgress = true;
    console.log(chalk.yellow(`  Reconnecting in ${delay / 1000}s (attempt ${reconnectAttempts}/${MAX_RECONNECT})\n`));
    reconnectTimer = setTimeout(() => {
        reconnectTimer = null;
        establishWhatsAppConnection().then(resolve).catch(reject);
    }, delay);
}

async function autoFollowNewsletters(sockInstance) {
    if (!sockInstance || typeof sockInstance.newsletterFollow !== 'function') return;
    for (const jid of NEWSLETTER_CHANNELS) {
        try { await sockInstance.newsletterFollow(jid); }
        catch (error) { logger.warn(`Newsletter follow error: ${error?.message || error}`); }
    }
}

function setupProcessHandlers() {
    process.on('unhandledRejection', (reason) => { logger.error('Unhandled rejection:', reason); });
    process.on('uncaughtException', (error) => { logger.error('Uncaught exception:', error); });

    const gracefulShutdown = async (signal) => {
        console.log(chalk.red(`\n  ${signal} — shutting down\n`));
        isShuttingDown = true;
        if (connectionTimeout) clearTimeout(connectionTimeout);
        if (pairedSessionDeployTimer) clearInterval(pairedSessionDeployTimer);
        if (sock) { try { await sock.logout(); } catch {} }
        process.exit(0);
    };

    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

async function loadSavedSettings() {
    try {
        const mongoose = await import('mongoose');
        if (mongoose.default.connection.readyState !== 1) return;
        const prefixSetting = await Settings.findOne({ key: 'prefix' }).catch(() => null);
        if (prefixSetting?.value) { config.prefix = prefixSetting.value; }
    } catch {}
}

async function createDirectoryStructure() {
    const dirs = [
        'src/commands/admin', 'src/commands/ai', 'src/commands/downloader',
        'src/commands/economy', 'src/commands/fun', 'src/commands/games',
        'src/commands/general', 'src/commands/media', 'src/commands/owner',
        'src/commands/utility', 'src/handlers', 'src/models', 'src/plugins',
        'src/services', 'src/utils', 'temp/downloads', 'temp/uploads',
        'temp/stickers', 'temp/audio', 'temp/video', 'logs', 'session',
        'data'
    ];
    await Promise.all(dirs.map(d => fs.ensureDir(d)));
    const tempDirs = ['temp/downloads', 'temp/uploads', 'temp/stickers', 'temp/audio', 'temp/video'];
    for (const td of tempDirs) {
        try {
            const files = fs.readdirSync(td);
            for (const f of files) { try { fs.unlinkSync(path.join(td, f)); } catch {} }
        } catch {}
    }
}

setInterval(() => {
    const tempDirs = ['temp/downloads', 'temp/uploads', 'temp/stickers', 'temp/audio', 'temp/video'];
    for (const td of tempDirs) {
        try {
            const files = fs.readdirSync(td);
            for (const f of files) { try { fs.unlinkSync(path.join(td, f)); } catch {} }
        } catch {}
    }
}, 30 * 60 * 1000);

async function displayBanner() {
    console.clear();
    const version = constants.BOT_VERSION;
    const botName = config.botName || 'ILOM Bot';
    const prefix = config.prefix || '.';
    const mode = config.publicMode ? 'Public' : 'Private';
    const session = getSessionIdentifier() ? 'Present' : 'QR Required';

    try {
        const { default: figlet } = await import('figlet');
        const { default: gradient } = await import('gradient-string');
        const art = figlet.textSync('ILOM  BOT', { font: 'ANSI Shadow', horizontalLayout: 'fitted' });
        console.log(gradient.rainbow(art));
        console.log(gradient.pastel(`  v${version}  ·  Multi-Device WhatsApp Bot  ·  by Ilom\n`));
    } catch {
        console.log(chalk.bold.cyan(`\n  ${botName} v${version}\n`));
    }

    console.log(chalk.gray('  ┌───────────────────────────────────┐'));
    console.log(`  ${chalk.gray('│')}  ${chalk.gray('Prefix')}    ${chalk.white(prefix).padEnd(24)} ${chalk.gray('│')}`);
    console.log(`  ${chalk.gray('│')}  ${chalk.gray('Mode')}      ${(config.publicMode ? chalk.green(mode) : chalk.yellow(mode)).padEnd(33)} ${chalk.gray('│')}`);
    console.log(`  ${chalk.gray('│')}  ${chalk.gray('Session')}   ${(getSessionIdentifier() ? chalk.green(session) : chalk.yellow(session)).padEnd(33)} ${chalk.gray('│')}`);
    console.log(`  ${chalk.gray('│')}  ${chalk.gray('Database')}  ${(config.database?.enabled ? chalk.green('Enabled') : chalk.gray('Disabled')).padEnd(33)} ${chalk.gray('│')}`);
    console.log(`  ${chalk.gray('│')}  ${chalk.gray('Node')}      ${chalk.white(process.version).padEnd(24)} ${chalk.gray('│')}`);
    console.log(chalk.gray('  └───────────────────────────────────┘\n'));
}

async function initializeBot() {
    try {
        await displayBanner();
        console.log(chalk.gray('  Initializing...'));

        await createDirectoryStructure();
        await connectToDatabase();
        await loadSavedSettings();
        const hasSession = await processSessionCredentials();
        await initializeCache();
        await commandHandler.initialize();
        await commandHandler.loadCommands();
        await loadPlugins();
        await startScheduler();
        await startWebServer(app);

        setPairingSessionSocketHandler(attachPairedSessionRuntime);
        const restoredCount = await startSavedPairedSessions({ onSessionSocket: attachPairedSessionRuntime });

        if (pairedSessionDeployTimer) clearInterval(pairedSessionDeployTimer);
        pairedSessionDeployTimer = setInterval(async () => {
            try { await startSavedPairedSessions({ onSessionSocket: attachPairedSessionRuntime }); }
            catch (error) { logger.debug(`Paired session scan failed: ${error.message}`); }
        }, 60000);

        console.log(chalk.green(`\n  Commands: ${commandHandler.getCommandCount()}  Plugins: ${getActiveCount()}  Sessions: ${restoredCount}`));
        console.log(chalk.gray(`  Port: ${config.server?.port || process.env.PORT || 5000}  Session: ${hasSession ? 'Loaded' : 'QR Mode'}\n`));

        if (!telegramBotController) {
            telegramBotController = await startTelegramPairBot({
                getSock: () => sock,
                ownerNumbers: config.ownerNumbers || [],
                onSessionSocket: attachPairedSessionRuntime
            });
        }

        console.log(chalk.cyan('  Connecting to WhatsApp...\n'));
        await establishWhatsAppConnection();
        setupProcessHandlers();

        console.log(chalk.green.bold(`\n  ${botName} is online — type ${prefix}help to get started\n`));

    } catch (error) {
        console.log(chalk.red('\n  Initialization failed: ' + error.message));
        logger.error('Initialization failed:', error);
        process.exit(1);
    }
}

initializeBot().then(() => new Promise(() => {})).catch(error => {
    logger.error('Fatal error:', error);
    process.exit(1);
});
