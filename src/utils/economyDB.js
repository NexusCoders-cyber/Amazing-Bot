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
    createdAt: null
};

function ensureFile() {
    const dir = dirname(DATA_PATH);
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    if (!existsSync(DATA_PATH)) writeFileSync(DATA_PATH, '{}', 'utf8');
}

function readStore() {
    ensureFile();
    try { return JSON.parse(readFileSync(DATA_PATH, 'utf8')); } catch { return {}; }
}

function writeStore(store) {
    ensureFile();
    writeFileSync(DATA_PATH, JSON.stringify(store, null, 2), 'utf8');
}

function toKey(userId) {
    const stripped = String(userId).replace(/[^0-9]/g, '');
    return stripped || String(userId);
}

function toTs(val) {
    if (!val) return null;
    if (typeof val === 'number') return val;
    const d = new Date(val);
    return isNaN(d.getTime()) ? null : d.getTime();
}

let migrationDone = false;

function runMigration() {
    if (migrationDone) return;
    migrationDone = true;

    if (!existsSync(LEGACY_PATH)) return;

    const store = readStore();
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
                wallet:      eco.balance      ?? 1000,
                bank:        eco.bank         ?? 0,
                level:       eco.level        ?? 1,
                xp:          eco.xp           ?? 0,
                streak:      eco.dailyStreak  ?? eco.streak ?? 0,
                diamonds:    eco.diamonds     ?? 0,
                stars:       eco.stars        ?? 0,
                lastDaily:   toTs(eco.lastDaily),
                lastWeekly:  toTs(eco.lastWeekly),
                lastWork:    toTs(eco.lastWork),
                totalEarned: eco.balance      ?? 1000,
                createdAt:   toTs(userData.createdAt) || Date.now()
            };
        }

        if (Object.keys(migrated).length > 0) {
            writeStore(migrated);
        }
    } catch {}
}

export function getEco(userId) {
    runMigration();
    const key = toKey(userId);
    const store = readStore();
    if (!store[key]) {
        store[key] = { ...DEFAULTS, createdAt: Date.now() };
        writeStore(store);
    }
    return { ...DEFAULTS, ...store[key] };
}

export function saveEco(userId, data) {
    runMigration();
    const key = toKey(userId);
    const store = readStore();
    store[key] = { ...(store[key] || { ...DEFAULTS, createdAt: Date.now() }), ...data };
    writeStore(store);
    syncToUserModel(userId, store[key]).catch(() => {});
}

export function getAllEco() {
    runMigration();
    const store = readStore();
    return Object.entries(store).map(([phone, data]) => ({
        phone,
        jid: phone.includes('@') ? phone : phone + '@s.whatsapp.net',
        ...DEFAULTS,
        ...data,
        netWorth: (data.wallet || 0) + (data.bank || 0)
    }));
}

export function hasEffect(eco, effectId) {
    if (!Array.isArray(eco.activeEffects)) return false;
    return eco.activeEffects.some(e => e.id === effectId && e.expiresAt > Date.now());
}

export function addEffect(eco, effectId, durationMs) {
    const effects = (eco.activeEffects || []).filter(e => e.id !== effectId);
    effects.push({ id: effectId, expiresAt: Date.now() + durationMs });
    return effects;
}

export function cleanEffects(eco) {
    const now = Date.now();
    return (eco.activeEffects || []).filter(e => e.expiresAt > now);
}

export function addXp(eco, amount) {
    const xp = (eco.xp || 0) + amount;
    const level = Math.floor(1 + Math.sqrt(xp / 100));
    return { xp, level };
}

export function fmtCoins(n) {
    return Number(n || 0).toLocaleString();
}

export function fmtTime(ms) {
    if (!ms || ms <= 0) return null;
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}d ${h % 24}h`;
    if (h > 0) return `${h}h ${m % 60}m`;
    if (m > 0) return `${m}m ${s % 60}s`;
    return `${s}s`;
}

export function cooldownLeft(lastTs, cooldownMs) {
    if (!lastTs) return 0;
    return Math.max(0, cooldownMs - (Date.now() - lastTs));
}

async function syncToUserModel(userId, data) {
    try {
        const { updateUser } = await import('../models/User.js');
        await updateUser(userId, {
            'economy.balance':    data.wallet    ?? 0,
            'economy.bank':       data.bank      ?? 0,
            'economy.xp':         data.xp        ?? 0,
            'economy.level':      data.level     ?? 1,
            'economy.streak':     data.streak    ?? 0,
            'economy.diamonds':   data.diamonds  ?? 0,
            'economy.stars':      data.stars     ?? 0,
            'economy.lastDaily':  data.lastDaily  ? new Date(data.lastDaily)  : null,
            'economy.lastWeekly': data.lastWeekly ? new Date(data.lastWeekly) : null,
            'economy.lastWork':   data.lastWork   ? new Date(data.lastWork)   : null
        });
    } catch {}
}
