import usersData from './usersData.js';
import threadsData from './threadsData.js';
import { saveEcoName } from './economyDB.js';
import commandHandler from '../handlers/commandHandler.js';

const groupRefreshThrottle = new Map();
const THROTTLE_MS = 5 * 60 * 1000;

export async function backfillGroups(sock) {
    try {
        const groups = await sock.groupFetchAllParticipating();
        const entries = Object.entries(groups || {});
        for (const [jid, meta] of entries) {
            await threadsData.create(jid, meta);
            await threadsData.refreshInfo(jid, meta);
            groupRefreshThrottle.set(jid, Date.now());
            if (global._botGroupCache) global._botGroupCache.set(jid, Date.now());
        }
        return entries.length;
    } catch {
        return 0;
    }
}

export async function captureMessageSender(sock, message) {
    const pushName = message?.pushName;
    if (!pushName) return;
    try {
        const { senderJid } = await commandHandler.resolveSenderContext(sock, message);
        const key = String(senderJid || '')
            .replace(/@s\.whatsapp\.net|@c\.us|@g\.us|@lid|@broadcast/g, '')
            .split(':')[0]
            .replace(/[^0-9]/g, '');
        if (!key || key.length < 5) return;
        await usersData.refreshInfo(key, { name: pushName });
        saveEcoName(key, pushName);
    } catch {}
}

export async function captureGroupInfo(sock, groupJid) {
    if (!groupJid) return;
    const last = groupRefreshThrottle.get(groupJid) || 0;
    if (Date.now() - last < THROTTLE_MS) return;
    groupRefreshThrottle.set(groupJid, Date.now());
    try {
        const meta = await sock.groupMetadata(groupJid);
        await threadsData.create(groupJid, meta);
        await threadsData.refreshInfo(groupJid, meta);
    } catch {}
}
