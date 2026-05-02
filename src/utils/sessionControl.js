import fs from 'fs-extra';
import path from 'path';
import config from '../config.js';

const STORE_FILE = path.join(process.cwd(), 'data', 'session-control.json');

function normalizeNumber(value = '') {
    const num = String(value || '')
        .replace(/@s\.whatsapp\.net|@c\.us|@g\.us|@broadcast|@lid/g, '')
        .split(':')[0]
        .replace(/[^0-9]/g, '');
    return num.length >= 7 ? num : '';
}

function toJid(num) {
    const n = normalizeNumber(num);
    return n ? `${n}@s.whatsapp.net` : '';
}

function sessionIdFromSock(sock) {
    const id = sock?.user?.id || sock?.authState?.creds?.me?.id || '';
    const n = normalizeNumber(id);
    return n || 'default';
}

function getAllConfiguredNumbers() {
    const result = new Set();

    const fromEnvOwners = String(process.env.OWNER_NUMBERS || '').split(',').map(normalizeNumber).filter(Boolean);
    const fromEnvSudo = String(process.env.SUDO_NUMBERS || '').split(',').map(normalizeNumber).filter(Boolean);
    const fromEnvDev = String(process.env.DEVELOPER_NUMBERS || process.env.DEV_NUMBERS || '').split(',').map(normalizeNumber).filter(Boolean);
    const fromEnvTop = normalizeNumber(process.env.TOP_OWNER_NUMBER || process.env.TOP_OWNER || '');
    const fromConfig = (config.ownerNumbers || []).map(normalizeNumber).filter(Boolean);
    const fromConfigSudo = (config.sudoers || []).map(normalizeNumber).filter(Boolean);

    for (const n of [...fromConfig, ...fromConfigSudo, ...fromEnvOwners, ...fromEnvSudo, ...fromEnvDev]) {
        result.add(n);
    }
    if (fromEnvTop) result.add(fromEnvTop);

    return [...result];
}

function getDefaultOwnerNumbers(sock) {
    const defaults = new Set(getAllConfiguredNumbers());
    const botNum = normalizeNumber(sock?.user?.id || '');
    if (botNum) defaults.add(botNum);
    return [...defaults];
}

async function loadStore() {
    try {
        const data = await fs.readJSON(STORE_FILE);
        return data && typeof data === 'object' ? data : {};
    } catch {
        return {};
    }
}

async function saveStore(store) {
    await fs.ensureDir(path.dirname(STORE_FILE));
    await fs.writeJSON(STORE_FILE, store, { spaces: 2 });
}

export async function getSessionControl(sock) {
    const sid = sessionIdFromSock(sock);
    const store = await loadStore();
    const row = store[sid] || {};
    const owners = new Set([...(row.owners || []), ...getDefaultOwnerNumbers(sock)].map(normalizeNumber).filter(Boolean));
    const allSudoers = new Set([
        ...(row.sudoers || []),
        ...((config.sudoers || []).map(normalizeNumber).filter(Boolean)),
        ...String(process.env.SUDO_NUMBERS || '').split(',').map(normalizeNumber).filter(Boolean)
    ]);

    return {
        sessionId: sid,
        prefix: row.prefix || config.prefix,
        privateMode: row.privateMode === true,
        owners: [...owners],
        sudoers: [...allSudoers]
    };
}

export async function updateSessionControl(sock, patch = {}) {
    const sid = sessionIdFromSock(sock);
    const store = await loadStore();
    const current = await getSessionControl(sock);
    const next = {
        prefix: typeof patch.prefix === 'string' && patch.prefix.trim() ? patch.prefix.trim() : current.prefix,
        privateMode: typeof patch.privateMode === 'boolean' ? patch.privateMode : current.privateMode,
        owners: Array.isArray(patch.owners) ? patch.owners.map(normalizeNumber).filter(Boolean) : current.owners,
        sudoers: Array.isArray(patch.sudoers) ? patch.sudoers.map(normalizeNumber).filter(Boolean) : current.sudoers
    };

    store[sid] = {
        ...store[sid],
        ...next,
        updatedAt: new Date().toISOString()
    };

    await saveStore(store);
    return await getSessionControl(sock);
}

export async function isOwnerForSession(sock, senderPhone = '') {
    const n = normalizeNumber(senderPhone);
    if (!n) return false;
    const allOwners = new Set(getDefaultOwnerNumbers(sock));
    if (allOwners.has(n)) return true;
    const control = await getSessionControl(sock);
    return control.owners.includes(n);
}

export async function isSudoForSession(sock, senderPhone = '') {
    if (await isOwnerForSession(sock, senderPhone)) return true;
    const n = normalizeNumber(senderPhone);
    if (!n) return false;
    const control = await getSessionControl(sock);
    return control.sudoers.includes(n);
}

export function normalizePhone(input = '') {
    return normalizeNumber(input);
}

export function toPhoneJid(input = '') {
    return toJid(input);
}
