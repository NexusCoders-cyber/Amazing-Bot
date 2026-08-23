import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const BAN_FILE = path.join(path.dirname(path.dirname(path.dirname(path.dirname(__filename)))), 'data', 'bans.json');

let _bans = null;
let _dirty = false;

function loadBans() {
    if (_bans) return _bans;
    try { _bans = fs.readJsonSync(BAN_FILE); }
    catch { _bans = { global: [], groups: {} }; }
    return _bans;
}

function saveBans() {
    if (!_dirty) return;
    try {
        fs.ensureDirSync(path.dirname(BAN_FILE));
        fs.writeJsonSync(BAN_FILE, _bans, { spaces: 2 });
        _dirty = false;
    } catch {}
}
setInterval(saveBans, 5000);

function cleanId(jid) {
    return String(jid || '').replace(/@s\.whatsapp\.net|@c\.us|@g\.us/g, '').split(':')[0];
}

export function isGlobalBanned(jid) {
    const id = cleanId(jid);
    return loadBans().global?.includes(id) || false;
}

export function globalBan(jid) {
    const id = cleanId(jid);
    const bans = loadBans();
    if (!bans.global.includes(id)) { bans.global.push(id); _dirty = true; }
}

export function globalUnban(jid) {
    const id = cleanId(jid);
    const bans = loadBans();
    bans.global = bans.global.filter(x => x !== id);
    _dirty = true;
}

export function isGroupBanned(groupJid, userJid) {
    const gid = cleanId(groupJid);
    const uid = cleanId(userJid);
    return loadBans().groups?.[gid]?.includes(uid) || false;
}

export function groupBan(groupJid, userJid) {
    const gid = cleanId(groupJid);
    const uid = cleanId(userJid);
    const bans = loadBans();
    if (!bans.groups[gid]) bans.groups[gid] = [];
    if (!bans.groups[gid].includes(uid)) { bans.groups[gid].push(uid); _dirty = true; }
}

export function groupUnban(groupJid, userJid) {
    const gid = cleanId(groupJid);
    const uid = cleanId(userJid);
    const bans = loadBans();
    if (bans.groups[gid]) {
        bans.groups[gid] = bans.groups[gid].filter(x => x !== uid);
        _dirty = true;
    }
}

export async function checkBan(sock, message) {
    const from = message?.key?.remoteJid;
    const sender = message?.key?.participant || message?.key?.remoteJid;
    if (!from || !sender) return false;
    const sId = cleanId(sender);
    if (isGlobalBanned(sId)) {
        try { await sock.sendMessage(from, { text: 'You are globally banned from this bot.' }, { quoted: message }); } catch {}
        return true;
    }
    if (from.endsWith('@g.us') && isGroupBanned(from, sender)) {
        try {
            await sock.groupParticipantsUpdate(from, [sender.includes('@') ? sender : sender + '@s.whatsapp.net'], 'remove');
        } catch {}
        return true;
    }
    return false;
}

export function isBanned(groupJid, userJid) {
    return isGroupBanned(groupJid, userJid);
}

export function getAllBans() {
    return loadBans();
}
