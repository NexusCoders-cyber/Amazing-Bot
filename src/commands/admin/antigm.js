import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'antigm.json');
let _data = null;
function load() { if (_data) return _data; try { _data = fs.readJsonSync(FILE); } catch { _data = {}; } return _data; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _data, { spaces: 2 }); }

export function isAntiGmEnabled(jid) {
    return !!(load()[jid]?.enabled);
}

export default {
    config: {
        name: 'antigm',
        aliases: ['antigroup'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Prevent bot from responding when not called',
        category: 'admin',
        coolDown: 3,
        role: 1,
        guide: { en: '{prefix}antigm on|off' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        const d = load();
        if (!d[from]) d[from] = { enabled: false };
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'on') { d[from].enabled = true; save(); return reply('Anti-GM enabled. Bot will not respond unless called.'); }
        if (sub === 'off') { d[from].enabled = false; save(); return reply('Anti-GM disabled.'); }
        reply(`Anti-GM: ${d[from].enabled ? 'ON' : 'OFF'}`);
    },
};
