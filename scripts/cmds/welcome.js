import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'welcome.json');
let _data = null;
function load() { if (_data) return _data; try { _data = fs.readJsonSync(FILE); } catch { _data = {}; } return _data; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _data, { spaces: 2 }); }

export function getWelcomeConfig(jid) {
    return load()[jid] || { welcome: { enabled: false, message: 'Welcome {name} to {group}!' }, goodbye: { enabled: false, message: 'Goodbye {name}!' } };
}
export function setWelcomeConfig(jid, cfg) { const d = load(); d[jid] = cfg; save(); }

export default {
    config: {
        name: 'welcome',
        aliases: ['setwelcome'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Set welcome and goodbye messages for new members',
        category: 'admin',
        coolDown: 5,
        role: 1,
        guide: { en: '{prefix}welcome on|off|set <message>|goodbye on|off|set <message>' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin, sock }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');

        const sub = (args[0] || '').toLowerCase();
        const cfg = getWelcomeConfig(from);

        if (sub === 'on') { cfg.welcome.enabled = true; setWelcomeConfig(from, cfg); return reply('Welcome message enabled.'); }
        if (sub === 'off') { cfg.welcome.enabled = false; setWelcomeConfig(from, cfg); return reply('Welcome message disabled.'); }
        if (sub === 'set' && args.slice(1).length) {
            cfg.welcome.message = args.slice(1).join(' ');
            setWelcomeConfig(from, cfg);
            return reply('Welcome message set. Variables: {name} {group} {count}');
        }
        if (sub === 'goodbye') {
            const sub2 = (args[1] || '').toLowerCase();
            if (sub2 === 'on') { cfg.goodbye.enabled = true; setWelcomeConfig(from, cfg); return reply('Goodbye message enabled.'); }
            if (sub2 === 'off') { cfg.goodbye.enabled = false; setWelcomeConfig(from, cfg); return reply('Goodbye message disabled.'); }
            if (sub2 === 'set' && args.slice(2).length) {
                cfg.goodbye.message = args.slice(2).join(' ');
                setWelcomeConfig(from, cfg);
                return reply('Goodbye message set.');
            }
        }

        reply([
            `Welcome: ${cfg.welcome.enabled ? 'ON' : 'OFF'}`,
            `Goodbye: ${cfg.goodbye.enabled ? 'ON' : 'OFF'}`,
            ``,
            `Welcome msg: ${cfg.welcome.message}`,
            `Goodbye msg: ${cfg.goodbye.message}`,
            ``,
            `Variables: {name} {group} {count}`,
        ].join('\n'));
    },
};
