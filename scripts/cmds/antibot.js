import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'antibot.json');
let _data = null;

function load() { if (_data) return _data; try { _data = fs.readJsonSync(FILE); } catch { _data = {}; } return _data; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _data, { spaces: 2 }); }

export default {
    config: {
        name: 'antibot',
        aliases: ['botfilter', 'kickbots'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Auto-kick bots that join the group',
        category: 'admin',
        coolDown: 5,
        role: 1,
        guide: { en: '{prefix}antibot on|off' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');

        const sub = (args[0] || '').toLowerCase();
        const data = load();

        if (sub === 'on') {
            data[from] = { enabled: true };
            save();
            return reply('🤖 Anti-bot enabled. Non-human accounts will be kicked on join.');
        }
        if (sub === 'off') {
            data[from] = { enabled: false };
            save();
            return reply('Anti-bot disabled.');
        }

        reply(`Anti-bot: ${data[from]?.enabled ? 'ON ✅' : 'OFF ❌'}`);
    },

    // Event handler for group participant updates
    onEvent: async ({ event, sock }) => {
        try {
            const data = load();
            const groupId = event.id;
            if (!data[groupId]?.enabled) return;

            if (event.action === 'add') {
                for (const participant of event.participants) {
                    const phone = participant.split('@')[0];
                    // Heuristic: bot accounts often have sequential/repeated digits
                    const isBotish = /^(\d{9,12})$/.test(phone) && (
                        /(.)\1{3,}/.test(phone) || // repeated digits
                        /12345/.test(phone) ||
                        /0000/.test(phone)
                    );

                    if (isBotish) {
                        try {
                            await sock.groupParticipantsUpdate(groupId, [participant], 'remove');
                            await sock.sendMessage(groupId, { text: `🤖 Bot detected and removed: +${phone}` });
                        } catch {}
                    }
                }
            }
        } catch {}
    },
};
