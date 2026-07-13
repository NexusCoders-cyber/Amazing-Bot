import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const AFK_FILE = new URL('../../data/afk.json', import.meta.url).pathname;

function ensureDir() {
    const dir = dirname(AFK_FILE);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function read() {
    ensureDir();
    if (!existsSync(AFK_FILE)) return {};
    try { return JSON.parse(readFileSync(AFK_FILE, 'utf8')); } catch { return {}; }
}

function write(data) {
    ensureDir();
    writeFileSync(AFK_FILE, JSON.stringify(data, null, 2));
}

export function setAfk(jid, reason = '') {
    const store = read();
    store[jid] = { reason: reason.trim() || 'No reason provided', time: Date.now() };
    write(store);
}

export function removeAfk(jid) {
    const store = read();
    const data = store[jid] || null;
    delete store[jid];
    write(store);
    return data;
}

export function isAfk(jid) {
    return !!read()[jid];
}

export function getAfkData(jid) {
    return read()[jid] || null;
}

export function getAllAfk() {
    return read();
}
