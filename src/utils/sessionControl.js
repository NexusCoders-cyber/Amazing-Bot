import config from '../config.js';
import fs from 'fs-extra';
import path from 'path';

const STORE_FILE = path.join(process.cwd(), 'data', 'bot-config.json');
const ENV_FILE   = path.join(process.cwd(), '.env');

let _cache = null;
const _runtimeSudoers = new Set();

function strip(v) {
    const s = String(v || '').replace(/[^0-9]/g, '');
    return s.length >= 7 ? s : '';
}

function stripJid(jid) {
    return strip(String(jid || '').split('@')[0].split(':')[0]);
}

function botNum(sock) {
    return strip(sock?.user?.id || '');
}

function envOwners() {
    return [...config.ownerNumbersRaw];
}

function envSudoers() {
    return [
        ...envOwners(),
        ...config.sudoNumbersRaw,
    ];
}

function allOwners() {
    return [...new Set(envOwners())];
}

function allSudoers() {
    return [...new Set([...envSudoers(), ..._runtimeSudoers])];
}

async function loadStore() {
    if (_cache) return _cache;
    try { _cache = await fs.readJSON(STORE_FILE); }
    catch { _cache = {}; }
    return _cache;
}

async function saveStore(data) {
    _cache = data;
    await fs.ensureDir(path.dirname(STORE_FILE));
    await fs.writeJSON(STORE_FILE, data, { spaces: 2 });
}

async function persistSudoersToEnv(numbers) {
    const owners = allOwners();
    const toWrite = [...new Set(numbers)].filter(n => !owners.includes(n));
    try {
        let content = '';
        if (await fs.pathExists(ENV_FILE)) content = await fs.readFile(ENV_FILE, 'utf8');
        const lines = content.split('\n');
        const idx = lines.findIndex(l => l.startsWith('SUDO_NUMBERS='));
        const line = `SUDO_NUMBERS=${toWrite.join(',')}`;
        if (idx !== -1) lines[idx] = line;
        else lines.push(line);
        await fs.writeFile(ENV_FILE, lines.join('\n'), 'utf8');
    } catch {}
    process.env.SUDO_NUMBERS = toWrite.join(',');
}

export async function addSudoer(phoneNumber) {
    const num = strip(phoneNumber);
    if (!num) return;
    _runtimeSudoers.add(num);
    const current = [...new Set([...envSudoers(), ..._runtimeSudoers])].filter(n => !allOwners().includes(n));
    await persistSudoersToEnv(current);
}

export async function removeSudoer(phoneNumber) {
    const num = strip(phoneNumber);
    if (!num) return;
    _runtimeSudoers.delete(num);
    const current = [...new Set([...envSudoers(), ..._runtimeSudoers])]
        .filter(n => n !== num && !allOwners().includes(n));
    await persistSudoersToEnv(current);
}

export async function getSessionControl(sock) {
    const store = await loadStore();
    return {
        sessionId: botNum(sock) || 'default',
        prefix: store.prefix || config.prefix,
        privateMode: store.privateMode === true,
        owners: allOwners(),
        sudoers: allSudoers(),
    };
}

export async function updateSessionControl(sock, patch = {}) {
    const store = await loadStore();
    if (typeof patch.prefix === 'string' && patch.prefix.trim()) store.prefix = patch.prefix.trim();
    if (typeof patch.privateMode === 'boolean') store.privateMode = patch.privateMode;
    await saveStore(store);
    return getSessionControl(sock);
}

export async function isOwnerForSession(sock, senderPhone = '') {
    const num = strip(senderPhone);
    if (!num) return false;
    return allOwners().includes(num) || num === botNum(sock);
}

export async function isSudoForSession(sock, senderPhone = '') {
    if (await isOwnerForSession(sock, senderPhone)) return true;
    const num = strip(senderPhone);
    return !!num && allSudoers().includes(num);
}

export function normalizePhone(input = '') { return strip(input); }
export function toPhoneJid(input = '') {
    const num = strip(input);
    return num ? `${num}@s.whatsapp.net` : '';
}

export async function listAllSessions() { return []; }
export async function getSessionControlById(sid) {
    return { ...(await getSessionControl(null)), sessionId: sid || 'default' };
}
export async function updateSessionControlById(sid, patch = {}) {
    return updateSessionControl(null, patch);
}
export async function deleteSessionControl() {}
