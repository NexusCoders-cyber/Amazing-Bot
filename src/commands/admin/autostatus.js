import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'autostatus.json');
let _cfg = null;
function load() { if (_cfg) return _cfg; try { _cfg = fs.readJsonSync(FILE); } catch { _cfg = { enabled: false, react: true, emoji: 'heart' }; } return _cfg; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _cfg, { spaces: 2 }); }

export function getAutoStatusConfig() { return load(); }

export default {
    config: {
        name: 'autostatus',
        aliases: ['statusview'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Auto view and react to status updates',
        category: 'owner',
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}autostatus on|off|react on|off|emoji <emoji>' },
    },
    async onStart({ args, reply }) {
        const cfg = load();
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'on') { cfg.enabled = true; save(); return reply('Auto status view enabled.'); }
        if (sub === 'off') { cfg.enabled = false; save(); return reply('Auto status view disabled.'); }
        if (sub === 'react') {
            cfg.react = (args[1] || '').toLowerCase() !== 'off';
            save();
            return reply(`Status react: ${cfg.react ? 'ON' : 'OFF'}`);
        }
        if (sub === 'emoji' && args[1]) { cfg.emoji = args[1]; save(); return reply(`React emoji set to: ${cfg.emoji}`); }
        reply(`View: ${cfg.enabled ? 'ON' : 'OFF'}\nReact: ${cfg.react ? 'ON' : 'OFF'}\nEmoji: ${cfg.emoji}`);
    },
};
