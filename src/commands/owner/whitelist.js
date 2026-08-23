import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'whitelist.json');
let _wl = null;
function load() { if (_wl) return _wl; try { _wl = fs.readJsonSync(FILE); } catch { _wl = { enabled: false, groups: [] }; } return _wl; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _wl, { spaces: 2 }); }

export function initWhitelist() { return load(); }
export function isWhitelisted(jid, data) {
    const d = data || load();
    if (!d?.enabled) return true;
    const id = String(jid || '').replace(/@s\.whatsapp\.net|@g\.us/g, '').split(':')[0];
    return d.groups?.includes(id) || false;
}

export default {
    config: {
        name: 'whitelist',
        aliases: ['wl'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Restrict bot to specific groups',
        category: 'owner',
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}whitelist on|off|add|remove|list' },
    },
    async onStart({ args, from, reply }) {
        const d = load();
        const sub = (args[0] || '').toLowerCase();
        const gid = from.split('@')[0];

        if (sub === 'on') { d.enabled = true; save(); return reply('Whitelist mode ON. Only whitelisted groups can use the bot.'); }
        if (sub === 'off') { d.enabled = false; save(); return reply('Whitelist mode OFF.'); }
        if (sub === 'add') {
            const target = args[1] ? args[1].replace(/[^0-9]/g, '') : gid;
            if (!d.groups.includes(target)) { d.groups.push(target); save(); }
            return reply(`${target} added to whitelist.`);
        }
        if (sub === 'remove') {
            const target = args[1] ? args[1].replace(/[^0-9]/g, '') : gid;
            d.groups = d.groups.filter(g => g !== target);
            save();
            return reply(`${target} removed from whitelist.`);
        }
        if (sub === 'list') return reply(`Whitelisted groups:\n${d.groups.join('\n') || 'None'}`);
        reply(`Whitelist: ${d.enabled ? 'ON' : 'OFF'}\nGroups: ${d.groups.length}\nUse: whitelist on|off|add|remove|list`);
    },
};
