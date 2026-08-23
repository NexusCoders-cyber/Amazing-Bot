import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'antigay.json');
let _data = null;
function load() { if (_data) return _data; try { _data = fs.readJsonSync(FILE); } catch { _data = {}; } return _data; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _data, { spaces: 2 }); }
function get(jid) { return load()[jid] || { enabled: false }; }

export async function checkGay(sock, message) {
    const from = message?.key?.remoteJid;
    if (!from?.endsWith('@g.us')) return false;
    if (!get(from).enabled) return false;
    return false;
}

export default {
    config: {
        name: 'antigay',
        aliases: [],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Anti-explicit content filter',
        category: 'admin',
        coolDown: 3,
        role: 1,
        guide: { en: '{prefix}antigay on|off' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        const d = load();
        if (!d[from]) d[from] = { enabled: false };
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'on') { d[from].enabled = true; save(); return reply('Anti-explicit filter enabled.'); }
        if (sub === 'off') { d[from].enabled = false; save(); return reply('Anti-explicit filter disabled.'); }
        reply(`Anti-explicit: ${d[from].enabled ? 'ON' : 'OFF'}`);
    },
};
