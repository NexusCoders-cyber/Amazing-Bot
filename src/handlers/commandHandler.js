import config from '../config.js';
import logger from '../utils/logger.js';
import {
    commandManager,
    getCommand,
    getAllCommands,
    getCommandsByCategory,
    searchCommands as searchCommandsUtil,
    getAllCategories,
    recordCommandUsage as recordUsage,
} from '../utils/commandManager.js';
import { createFontSock } from '../utils/fontSock.js';
import { getSessionControl, isOwnerForSession, isSudoForSession } from '../utils/sessionControl.js';
import { isTopOwner, isDeveloper } from '../utils/privilegedUsers.js';
import { createApi } from '../utils/amazingbotApi.js';
import { getAmazingBot } from '../utils/amazingbot.js';
import usersData from '../utils/usersData.js';
import threadsData from '../utils/threadsData.js';

function rawNum(jid) {
    if (!jid) return '';
    return String(jid)
        .replace(/@s\.whatsapp\.net|@c\.us|@g\.us|@broadcast|@lid/g, '')
        .split(':')[0]
        .replace(/[^0-9]/g, '');
}

function isLid(jid) {
    return !!(jid && String(jid).endsWith('@lid'));
}

function getBotPhone(sock) {
    for (const c of [sock?.user?.id, sock?.authState?.creds?.me?.id]) {
        if (!c || isLid(c)) continue;
        const n = rawNum(c);
        if (n && n.length >= 7) return n;
    }
    return '';
}

function getBotLid(sock) {
    for (const c of [sock?.user?.lid, sock?.authState?.creds?.me?.lid]) {
        if (c) return String(c).split('@')[0].split(':')[0];
    }
    return '';
}

function buildCtx(sock, fontSock, message, args, command, commandName, from, senderJid, isGroup, isGroupAdmin, isBotAdmin, isOwnerUser, isSudoUser, prefix) {
    const api = createApi(fontSock, from);
    const AmazingBot = getAmazingBot();

    const send = async (content, opts = {}) => {
        if (typeof content === 'string') return fontSock.sendMessage(from, { text: content }, opts);
        return fontSock.sendMessage(from, content, opts);
    };

    const reply = async (content, opts = {}) => {
        if (typeof content === 'string') return fontSock.sendMessage(from, { text: content }, { quoted: message, ...opts });
        return fontSock.sendMessage(from, content, { quoted: message, ...opts });
    };

    const React = async (emoji) => {
        return fontSock.sendMessage(from, { react: { key: message.key, text: emoji } });
    };

    return {
        sock: fontSock,
        api,
        message,
        event: message,
        args,
        command,
        commandName,
        from,
        sender: senderJid,
        isGroup,
        isGroupAdmin,
        isBotAdmin,
        prefix,
        pushName: message.pushName || '',
        quoted: message.message?.extendedTextMessage?.contextInfo?.quotedMessage || null,
        isOwner: isOwnerUser,
        isSudo: isSudoUser,
        usersData,
        threadsData,
        AmazingBot,
        getAllCommands,
        getCommandsByCategory,
        getAllCategories,
        getCommand,
        send,
        reply,
        React,
    };
}

class CommandHandler {
    constructor() {
        this.cooldowns = new Map();
        this.commandStats = new Map();
        this.groupCache = new Map();
        this.groupCacheTTL = 30000;
        this.isInitialized = false;
    }

    async initialize() {
        if (this.isInitialized) return true;
        try {
            await commandManager.initializeCommands();
            this.registerOnChatCommands();
            this.isInitialized = true;
            logger.info(`CommandHandler ready — ${getAllCommands().length} commands`);
            return true;
        } catch (err) {
            logger.error('CommandHandler init failed:', err);
            return false;
        }
    }

    async loadCommands() { return this.initialize(); }

    getCommand(name) { return getCommand(name); }
    getAllCommands() { return getAllCommands(); }
    getCommandsByCategory(cat) { return getCommandsByCategory(cat); }
    getAllCategories() { return getAllCategories(); }
    searchCommands(q) { return searchCommandsUtil(q); }
    getCommandCount() { return getAllCommands().length; }

    async getGroupMeta(sock, groupJid, force = false) {
        try {
            const cached = this.groupCache.get(groupJid);
            if (!force && cached && Date.now() - cached.ts < this.groupCacheTTL) return cached.data;
            const meta = await sock.groupMetadata(groupJid);
            this.groupCache.set(groupJid, { data: meta, ts: Date.now() });
            return meta;
        } catch { return null; }
    }

    findParticipant(participants, jid) {
        if (!jid || !participants?.length) return null;
        const jStr = String(jid);
        const phone = isLid(jStr) ? '' : rawNum(jStr);
        const lid = jStr.split('@')[0].split(':')[0];
        for (const p of participants) {
            const pStr = String(p.id || '');
            const pPhone = isLid(pStr) ? '' : rawNum(pStr);
            const pLid = pStr.split('@')[0].split(':')[0];
            if (phone && pPhone && phone === pPhone) return p;
            if (lid && pLid && lid === pLid) return p;
        }
        return null;
    }

    async resolvePhone(sock, groupJid, participantJid) {
        if (!participantJid) return '';
        if (!isLid(participantJid)) {
            const n = rawNum(participantJid);
            if (n && n.length >= 7) return n;
        }
        try {
            const meta = await this.getGroupMeta(sock, groupJid);
            if (meta?.participants) {
                const p = this.findParticipant(meta.participants, participantJid);
                if (p && !isLid(String(p.id || ''))) {
                    const n = rawNum(String(p.id));
                    if (n && n.length >= 7) return n;
                }
            }
        } catch {}
        return '';
    }

    resolvePrivatePhone(sock, fromMe, remoteJid, userJid) {
        if (fromMe) return getBotPhone(sock);
        for (const j of [userJid, remoteJid]) {
            if (j && !isLid(j)) { const n = rawNum(j); if (n && n.length >= 7) return n; }
        }
        return '';
    }

    async checkOwner(senderPhone, message, sock, rawJid = '') {
        const lid = rawJid ? rawJid.split('@')[0].split(':')[0] : '';
        const num = senderPhone?.length >= 7 ? senderPhone : lid;
        if (!num) {
            if (message?.key?.fromMe) {
                const bn = getBotPhone(sock);
                if (bn && (isTopOwner(bn) || await isOwnerForSession(sock, bn))) return true;
            }
            return false;
        }
        if (isTopOwner(num) || isDeveloper(num)) return true;
        if (lid && lid !== num && (isTopOwner(lid) || isDeveloper(lid))) return true;
        return isOwnerForSession(sock, num);
    }

    async checkSudo(senderPhone, message, sock, rawJid = '') {
        if (await this.checkOwner(senderPhone, message, sock, rawJid)) return true;
        const lid = rawJid ? rawJid.split('@')[0].split(':')[0] : '';
        const num = senderPhone?.length >= 7 ? senderPhone : lid;
        if (!num) return false;
        if (isDeveloper(num)) return true;
        if (lid && lid !== num && isDeveloper(lid)) return true;
        return isSudoForSession(sock, num);
    }

    checkCooldown(commandName, key, isOwnerUser, isSudoUser) {
        const cmd = getCommand(commandName);
        if (!cmd?.cooldown || isOwnerUser || isSudoUser) return { onCooldown: false };
        const cKey = `${commandName}::${key}`;
        const now = Date.now();
        const ms = cmd.cooldown * 1000;
        const exp = this.cooldowns.get(cKey);
        if (exp && now < exp) return { onCooldown: true, timeLeft: ((exp - now) / 1000).toFixed(1) };
        this.cooldowns.set(cKey, now + ms);
        setTimeout(() => this.cooldowns.delete(cKey), ms);
        return { onCooldown: false };
    }

    async checkPermissions(cmd, sock, message, from, isGroup, isGroupAdmin, isBotAdmin, isOwnerUser, isSudoUser) {
        if (cmd.ownerOnly && !isOwnerUser) {
            await sock.sendMessage(from, { text: '❌ Owner only command.' }, { quoted: message });
            return false;
        }
        if (cmd.sudoOnly && !isSudoUser && !isOwnerUser) {
            await sock.sendMessage(from, { text: '❌ Sudo only command.' }, { quoted: message });
            return false;
        }
        if (cmd.groupOnly && !isGroup) {
            await sock.sendMessage(from, { text: '❌ This command can only be used in groups.' }, { quoted: message });
            return false;
        }
        if (cmd.privateOnly && isGroup) {
            await sock.sendMessage(from, { text: '❌ This command can only be used in private chat.' }, { quoted: message });
            return false;
        }
        if (isGroup && cmd.adminOnly && !isGroupAdmin && !isOwnerUser && !isSudoUser) {
            await sock.sendMessage(from, { text: '❌ Group admin only command.' }, { quoted: message });
            return false;
        }
        if (isGroup && cmd.botAdminRequired && !isBotAdmin) {
            await sock.sendMessage(from, { text: '❌ Bot must be group admin for this command.' }, { quoted: message });
            return false;
        }
        return true;
    }

    recordUsage(name, time, success) {
        if (!this.commandStats.has(name)) {
            this.commandStats.set(name, { count: 0, success: 0, fail: 0, totalTime: 0 });
        }
        const s = this.commandStats.get(name);
        s.count++;
        success ? s.success++ : s.fail++;
        s.totalTime += time;
        try { recordUsage(name, time, success); } catch {}
    }

    async resolveSenderContext(sock, message) {
        const from = message.key.remoteJid;
        const fromMe = message.key.fromMe;
        const isGroup = from.endsWith('@g.us');
        let rawParticipant = '';
        let senderPhone = '';
        if (isGroup) {
            rawParticipant = message.key.participant || '';
            senderPhone = fromMe
                ? (getBotPhone(sock) || await this.resolvePhone(sock, from, rawParticipant))
                : await this.resolvePhone(sock, from, rawParticipant);
        } else {
            rawParticipant = fromMe ? (sock?.user?.id || '') : from;
            senderPhone = this.resolvePrivatePhone(sock, fromMe, from, rawParticipant);
        }
        const senderJid = senderPhone ? `${senderPhone}@s.whatsapp.net` : (rawParticipant || from);
        return { from, fromMe, isGroup, rawParticipant, senderPhone, senderJid };
    }

    async handleCommand(sock, message, commandName, args) {
        const t0 = Date.now();
        const { from, fromMe, isGroup, rawParticipant, senderPhone, senderJid } = await this.resolveSenderContext(sock, message);

        try {
            const cmd = getCommand(commandName);
            if (!cmd) return false;

            const isOwnerUser = await this.checkOwner(senderPhone, message, sock, rawParticipant);
            const isSudoUser = await this.checkSudo(senderPhone, message, sock, rawParticipant);

            if (!isOwnerUser && !isSudoUser) {
                try {
                    const { isGlobalBanned } = await import('../commands/owner/ban.js');
                    if (await isGlobalBanned(senderJid)) {
                        await sock.sendMessage(from, { text: '🚫 You are globally banned.' }, { quoted: message });
                        return false;
                    }
                } catch {}
            }

            const session = await getSessionControl(sock);

            const cd = this.checkCooldown(commandName, senderPhone || from, isOwnerUser, isSudoUser);
            if (cd.onCooldown) {
                await sock.sendMessage(from, { text: `⏳ Wait ${cd.timeLeft}s before using this again.` }, { quoted: message });
                return false;
            }

            let isGroupAdmin = false;
            let isBotAdmin = false;
            if (isGroup) {
                try {
                    [isGroupAdmin, isBotAdmin] = await Promise.all([
                        this.isGroupAdmin(sock, from, rawParticipant),
                        this.isBotAdmin(sock, from),
                    ]);
                } catch {}
                if (isOwnerUser || isSudoUser) isGroupAdmin = true;
            } else if (isOwnerUser || isSudoUser) {
                isGroupAdmin = true;
                isBotAdmin = true;
            }

            const ok = await this.checkPermissions(cmd, sock, message, from, isGroup, isGroupAdmin, isBotAdmin, isOwnerUser, isSudoUser);
            if (!ok) { this.recordUsage(commandName, Date.now() - t0, false); return false; }

            if (cmd.args && args.length < (cmd.minArgs || 1)) {
                const prefix = session.prefix || config.prefix;
                await sock.sendMessage(from, {
                    text: `❌ Usage: ${prefix}${cmd.usage || cmd.name}\nExample: ${prefix}${cmd.example || cmd.name}`
                }, { quoted: message });
                return false;
            }

            const entry = cmd.onStart || cmd.execute;
            if (typeof entry !== 'function') {
                logger.error(`${commandName} has no onStart/execute`);
                return false;
            }

            const fontSock = createFontSock(sock, senderJid);
            const prefix = session.prefix || config.prefix;
            const ctx = buildCtx(sock, fontSock, message, args, cmd, commandName, from, senderJid, isGroup, isGroupAdmin, isBotAdmin, isOwnerUser, isSudoUser, prefix);

            await entry(ctx);
            this.recordUsage(commandName, Date.now() - t0, true);
            logger.info(`${commandName} executed in ${Date.now() - t0}ms`);
            return true;

        } catch (err) {
            this.recordUsage(commandName, Date.now() - t0, false);
            logger.error(`handleCommand [${commandName}]:`, err);
            try { await sock.sendMessage(from, { text: `❌ ${err.message}` }, { quoted: message }); } catch {}
            return false;
        }
    }

    async handleOnReply(sock, message, stanzaId) {
        const ab = getAmazingBot();
        const entry = ab.onReply.get(stanzaId);
        if (!entry) return false;

        const commandName = entry.commandName;
        const cmd = commandName ? getCommand(commandName) : null;
        if (!cmd || typeof cmd.onReply !== 'function') return false;

        const { from, isGroup, rawParticipant, senderPhone, senderJid } = await this.resolveSenderContext(sock, message);
        const isOwnerUser = await this.checkOwner(senderPhone, message, sock, rawParticipant);
        const isSudoUser = await this.checkSudo(senderPhone, message, sock, rawParticipant);
        const isGroupAdmin = isGroup ? await this.isGroupAdmin(sock, from, rawParticipant) : isOwnerUser;
        const isBotAdmin = isGroup ? await this.isBotAdmin(sock, from) : isOwnerUser;
        const session = await getSessionControl(sock);
        const fontSock = createFontSock(sock, senderJid);
        const prefix = session.prefix || config.prefix;

        const ctx = buildCtx(sock, fontSock, message, [], cmd, commandName, from, senderJid, isGroup, isGroupAdmin, isBotAdmin, isOwnerUser, isSudoUser, prefix);
        try { await cmd.onReply({ ...ctx, Reply: entry }); }
        catch (err) { logger.error(`onReply [${commandName}]:`, err); }
        return true;
    }

    async handleOnReaction(sock, message) {
        const reactionMsg = message.message?.reactionMessage;
        if (!reactionMsg) return false;
        const reactedId = reactionMsg.key?.id;
        if (!reactedId) return false;

        const ab = getAmazingBot();
        const entry = ab.onReaction.get(reactedId);
        if (!entry) return false;

        const commandName = entry.commandName;
        const cmd = commandName ? getCommand(commandName) : null;
        if (!cmd || typeof cmd.onReaction !== 'function') return false;

        const { from, isGroup, rawParticipant, senderPhone, senderJid } = await this.resolveSenderContext(sock, message);
        const isOwnerUser = await this.checkOwner(senderPhone, message, sock, rawParticipant);
        const isSudoUser = await this.checkSudo(senderPhone, message, sock, rawParticipant);
        const isGroupAdmin = isGroup ? await this.isGroupAdmin(sock, from, rawParticipant) : isOwnerUser;
        const isBotAdmin = isGroup ? await this.isBotAdmin(sock, from) : isOwnerUser;
        const session = await getSessionControl(sock);
        const fontSock = createFontSock(sock, senderJid);
        const prefix = session.prefix || config.prefix;

        const ctx = buildCtx(sock, fontSock, message, [], cmd, commandName, from, senderJid, isGroup, isGroupAdmin, isBotAdmin, isOwnerUser, isSudoUser, prefix);
        try {
            await cmd.onReaction({
                ...ctx,
                Reaction: { ...entry, emoji: reactionMsg.text || '', reactedToKey: reactionMsg.key },
            });
        } catch (err) { logger.error(`onReaction [${commandName}]:`, err); }
        return true;
    }

    async handleOnChat(sock, message, text) {
        const ab = getAmazingBot();
        const chatCmds = ab.onChat || [];
        if (!chatCmds.length) return;

        const { from, isGroup, rawParticipant, senderPhone, senderJid } = await this.resolveSenderContext(sock, message);
        const isOwnerUser = await this.checkOwner(senderPhone, message, sock, rawParticipant);
        const isSudoUser = await this.checkSudo(senderPhone, message, sock, rawParticipant);
        const session = await getSessionControl(sock);

        for (const { commandName, handler } of chatCmds) {
            const cmd = getCommand(commandName);
            if (!cmd) continue;
            const isGroupAdmin = isGroup ? await this.isGroupAdmin(sock, from, rawParticipant) : isOwnerUser;
            const isBotAdmin = isGroup ? await this.isBotAdmin(sock, from) : isOwnerUser;
            const fontSock = createFontSock(sock, senderJid);
            const prefix = session.prefix || config.prefix;
            const ctx = buildCtx(sock, fontSock, message, text.trim().split(/\s+/), cmd, commandName, from, senderJid, isGroup, isGroupAdmin, isBotAdmin, isOwnerUser, isSudoUser, prefix);
            try { await handler({ ...ctx, chatText: text }); }
            catch (err) { logger.error(`onChat [${commandName}]:`, err); }
        }
    }

    registerOnChatCommands() {
        const ab = getAmazingBot();
        ab.onChat = [];
        for (const cmd of getAllCommands()) {
            if (typeof cmd.onChat === 'function') {
                ab.onChat.push({ commandName: cmd.name, handler: cmd.onChat });
            }
        }
    }

    async isGroupAdmin(sock, groupJid, participantJid) {
        try {
            const meta = await this.getGroupMeta(sock, groupJid, true);
            const p = this.findParticipant(meta?.participants || [], participantJid);
            return !!(p?.admin);
        } catch { return false; }
    }

    async isBotAdmin(sock, groupJid) {
        try {
            const meta = await this.getGroupMeta(sock, groupJid, true);
            const botPhone = getBotPhone(sock);
            const botLid = getBotLid(sock);
            for (const p of meta?.participants || []) {
                const pStr = String(p.id || '');
                const pPhone = isLid(pStr) ? '' : rawNum(pStr);
                const pLid = pStr.split('@')[0].split(':')[0];
                if ((botPhone && pPhone && botPhone === pPhone) || (botLid && pLid && botLid === pLid)) {
                    return !!(p.admin);
                }
            }
            return false;
        } catch { return false; }
    }

    getCommandStats() {
        const out = { total: 0, success: 0, fail: 0, commands: {} };
        this.commandStats.forEach((s, name) => {
            out.total += s.count;
            out.success += s.success;
            out.fail += s.fail;
            out.commands[name] = { ...s, avgTime: s.count ? Math.round(s.totalTime / s.count) : 0 };
        });
        return out;
    }

    getTopCommands(limit = 5) {
        return Object.entries(this.getCommandStats().commands)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, limit)
            .map(([name, s]) => ({ name, used: s.count, successRate: s.count ? ((s.success / s.count) * 100).toFixed(1) : '0' }));
    }

    async reloadCommand(name) {
        try { await commandManager.reloadCommand(name); this.registerOnChatCommands(); return true; }
        catch (err) { logger.error(`Reload failed [${name}]:`, err); return false; }
    }
}

export const commandHandler = new CommandHandler();
export default commandHandler;
