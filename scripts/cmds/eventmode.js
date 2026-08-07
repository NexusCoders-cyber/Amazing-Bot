import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'eventmode.json');
let _data = null;

function load() { if (_data) return _data; try { _data = fs.readJsonSync(FILE); } catch { _data = {}; } return _data; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _data, { spaces: 2 }); }

export default {
    config: {
        name: 'eventmode',
        aliases: ['events', 'event'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Toggle event mode (restrict commands to event windows)',
        category: 'admin',
        coolDown: 5,
        role: 1,
        guide: { en: '{prefix}eventmode on|off|status|set <start> <end>' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');

        const sub = (args[0] || '').toLowerCase();
        const data = load();
        if (!data[from]) data[from] = { enabled: false, start: 0, end: 24 };

        if (sub === 'on') {
            data[from].enabled = true;
            save();
            return reply('🎉 Event mode enabled! Commands only work during event hours.');
        }
        if (sub === 'off') {
            data[from].enabled = false;
            save();
            return reply('Event mode disabled.');
        }
        if (sub === 'set') {
            const start = parseInt(args[1]);
            const end = parseInt(args[2]);
            if (isNaN(start) || isNaN(end)) return reply('Usage: eventmode set <start_hour> <end_hour> (0-23)');
            data[from].start = Math.max(0, Math.min(23, start));
            data[from].end = Math.max(0, Math.min(23, end));
            data[from].enabled = true;
            save();
            return reply(`🎉 Event mode set: ${data[from].start}:00 - ${data[from].end}:00`);
        }

        const { enabled, start, end } = data[from];
        reply([
            `🎪 *Event Mode*`,
            '',
            `Status : ${enabled ? 'ON ✅' : 'OFF ❌'}`,
            `Hours  : ${start}:00 - ${end}:00 (UTC)`,
        ].join('\n'));
    },
};
