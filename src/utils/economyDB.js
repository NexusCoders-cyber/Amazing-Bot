import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../../data/economy_v2.json');
const LEGACY_PATH = join(__dirname, '../../data/economy.json');

export const DEFAULTS = {
    wallet: 1000,
    bank: 0,
    bankCapacity: 50000,
    diamonds: 0,
    stars: 0,
    level: 1,
    xp: 0,
    streak: 0,
    lastDaily: null,
    lastWeekly: null,
    lastWork: null,
    lastRob: null,
    lastBeg: null,
    lastInterest: null,
    inventory: [],
    activeEffects: [],
    totalEarned: 1000,
    totalSpent: 0,
    badges: [],
    createdAt: null,
    name: null
};

function toKey(userId) {
    return String(userId || '')
        .replace(/@s\.whatsapp\.net|@c\.us|@g\.us|@lid|@broadcast/g, '')
        .split(':')[0]
        .replace(/[^0-9]/g, '');
}

export function resolveTarget(message, sender) {
    const ctx = message?.message?.extendedTextMessage?.contextInfo;
    const replied = ctx?.participant;
    const mentioned = ctx?.mentionedJid?.[0];
    return replied || mentioned || sender;
}

export function displayPhone(userId) {
    return toKey(userId) || String(userId || '').split('@')[0];
}

function toTs(v) {
    if (!v) return null;
    if (typeof v === 'number') return v;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d.getTime();
}

let store = null;
let dirty = false;

function ensureDir() {
    const dir = dirname(DATA_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

function loadStore() {
    if (store) return store;
    ensureDir();
    try {
        store = existsSync(DATA_PATH) ? JSON.parse(readFileSync(DATA_PATH, 'utf8')) : {};
    } catch (err) {
        console.error('[economyDB] Failed to read data file, starting fresh:', err.message);
        store = {};
    }
    runMigration();
    return store;
}

function flush() {
    if (!dirty || !store) return;
    try {
        ensureDir();
        writeFileSync(DATA_PATH, JSON.stringify(store, null, 2), 'utf8');
        dirty = false;
    } catch (err) {
        console.error('[economyDB] Failed to write data file:', err.message);
    }
}

setInterval(flush, 3000);
process.on('exit', flush);
process.on('SIGINT', () => { flush(); process.exit(0); });
process.on('SIGTERM', () => { flush(); process.exit(0); });

let migrationDone = false;

function runMigration() {
    if (migrationDone) return;
    migrationDone = true;

    if (!existsSync(LEGACY_PATH)) return;
    if (Object.keys(store).length > 0) return;

    try {
        const legacy = JSON.parse(readFileSync(LEGACY_PATH, 'utf8'));
        const migrated = {};

        for (const [jid, userData] of Object.entries(legacy)) {
            const key = toKey(jid);
            if (!key) continue;

            const eco = userData.economy || {};

            migrated[key] = {
                ...DEFAULTS,
                wallet: eco.balance ?? 1000,
                bank: eco.bank ?? 0,
                level: eco.level ?? 1,
                xp: eco.xp ?? 0,
                streak: eco.dailyStreak ?? eco.streak ?? 0,
                diamonds: eco.diamonds ?? 0,
                stars: eco.stars ?? 0,
                lastDaily: toTs(eco.lastDaily),
                lastWeekly: toTs(eco.lastWeekly),
                lastWork: toTs(eco.lastWork),
                totalEarned: eco.balance ?? 1000,
                createdAt: toTs(userData.createdAt) || Date.now()
            };
        }

        if (Object.keys(migrated).length > 0) {
            store = migrated;
            dirty = true;
            flush();
        }
    } catch (err) {
        console.error('[economyDB] Migration failed:', err.message);
    }
}

export function getEco(userId) {
    const db = loadStore();
    const key = toKey(userId);
    if (!key) return { ...DEFAULTS };
    if (!db[key]) {
        db[key] = { ...DEFAULTS, createdAt: Date.now() };
        dirty = true;
    }
    return db[key];
}

export function saveEco(userId, data) {
    const db = loadStore();
    const key = toKey(userId);
    if (!key) return null;
    db[key] = { ...(db[key] || DEFAULTS), ...data };
    dirty = true;
    syncToUserModel(key, db[key]).catch(() => {});
    return db[key];
}

export function getAllEco() {
    return { ...loadStore() };
}

export function saveEcoName(userId, name) {
    if (!name) return;
    const db = loadStore();
    const key = toKey(userId);
    if (!key) return;
    if (!db[key]) db[key] = { ...DEFAULTS, createdAt: Date.now() };
    if (db[key].name === name) return;
    db[key].name = name;
    dirty = true;
}

export function hasEffect(eco, effectId) {
    const now = Date.now();
    return (eco.activeEffects || []).some(e => e.id === effectId && e.expiresAt > now);
}

export function addEffect(eco, effectId, durationMs) {
    const effects = (eco.activeEffects || []).filter(e => e.id !== effectId);
    effects.push({ id: effectId, expiresAt: Date.now() + durationMs });
    eco.activeEffects = effects;
    return effects;
}

export function cleanEffects(eco) {
    const now = Date.now();
    return (eco.activeEffects || []).filter(e => e.expiresAt > now);
}

export function addXp(eco, amount) {
    const xp = (eco.xp || 0) + amount;
    const level = Math.floor(0.1 * Math.sqrt(xp)) + 1;
    return { xp, level };
}

export function fmtCoins(n) {
    return '$' + Number(n || 0).toLocaleString('en-US');
}

export function fmtTime(ms) {
    const s = Math.floor(ms / 1000);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}h ${m}m ${sec}s`;
    if (m > 0) return `${m}m ${sec}s`;
    return `${sec}s`;
}

export function cooldownLeft(lastTs, cooldownMs) {
    if (!lastTs) return 0;
    const left = cooldownMs - (Date.now() - lastTs);
    return left > 0 ? left : 0;
}

async function syncToUserModel(userId, data) {
    try {
        const { updateUser } = await import('../models/User.js');
        await updateUser(userId, {
            'economy.balance': data.wallet ?? 0,
            'economy.bank': data.bank ?? 0,
            'economy.xp': data.xp ?? 0,
            'economy.level': data.level ?? 1,
            'economy.streak': data.streak ?? 0,
            'economy.diamonds': data.diamonds ?? 0,
            'economy.stars': data.stars ?? 0,
            'economy.lastDaily': data.lastDaily ? new Date(data.lastDaily) : null,
            'economy.lastWeekly': data.lastWeekly ? new Date(data.lastWeekly) : null,
            'economy.lastWork': data.lastWork ? new Date(data.lastWork) : null
        });
    } catch {}
}
