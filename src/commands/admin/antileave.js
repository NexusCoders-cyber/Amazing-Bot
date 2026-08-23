import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'antileave.json');
let _data = null;
function load() { if (_data) return _data; try { _data = fs.readJsonSync(FILE); } catch { _data = {}; } return _data; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _data, { spaces: 2 }); }

export function isAntiLeaveEnabled(jid) {
    return !!(load()[String(jid || '').split('@')[0]]?.enabled);
}

export function setAntiLeave(jid, enabled) {
    const d = load();
    const id = String(jid || '').split('@')[0];
    d[id] = { enabled };
    save();
}

export default {
    config: {
        name: 'antileave',
        aliases: ['noleave'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Prevent members from leaving and auto re-add them',
        category: 'admin',
        coolDown: 5,
        role: 1,
        guide: { en: '{prefix}antileave on|off' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin, isBotAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        if (!isBotAdmin) return reply('I need admin rights for this.');
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'on') { setAntiLeave(from, true); return reply('Anti-leave enabled. Members who leave will be re-added.'); }
        if (sub === 'off') { setAntiLeave(from, false); return reply('Anti-leave disabled.'); }
        reply(`Anti-leave: ${isAntiLeaveEnabled(from) ? 'ON' : 'OFF'}`);
    },
};
