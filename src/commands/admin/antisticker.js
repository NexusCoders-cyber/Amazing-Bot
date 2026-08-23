import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'antisticker.json');
let _data = null;
function load() { if (_data) return _data; try { _data = fs.readJsonSync(FILE); } catch { _data = {}; } return _data; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _data, { spaces: 2 }); }
function get(jid) { return load()[jid] || { enabled: false }; }

export async function checkSticker(sock, message) {
    const from = message?.key?.remoteJid;
    if (!from?.endsWith('@g.us')) return false;
    if (!get(from).enabled) return false;
    if (!message?.message?.stickerMessage) return false;
    try { await sock.sendMessage(from, { delete: message.key }); } catch {}
    return true;
}

export default {
    config: {
        name: 'antisticker',
        aliases: ['nosticker'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Block stickers in group',
        category: 'admin',
        coolDown: 3,
        role: 1,
        guide: { en: '{prefix}antisticker on|off' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        const d = load();
        if (!d[from]) d[from] = { enabled: false };
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'on') { d[from].enabled = true; save(); return reply('Anti-sticker enabled.'); }
        if (sub === 'off') { d[from].enabled = false; save(); return reply('Anti-sticker disabled.'); }
        reply(`Anti-sticker: ${d[from].enabled ? 'ON' : 'OFF'}`);
    },
};
