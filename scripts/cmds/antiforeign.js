import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'antiforeign.json');
let _data = null;

function load() { if (_data) return _data; try { _data = fs.readJsonSync(FILE); } catch { _data = {}; } return _data; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _data, { spaces: 2 }); }

// Simple regex to detect non-Latin scripts
const FOREIGN_PATTERNS = /[\u0400-\u04FF\u0600-\u06FF\u0980-\u09FF\u0E00-\u0E7F\u1100-\u11FF\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FFF\uAC00-\uD7AF]/;

export default {
    config: {
        name: 'antiforeign',
        aliases: ['foreignfilter', 'langfilter'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Auto-delete messages in foreign languages',
        category: 'admin',
        coolDown: 5,
        role: 1,
        guide: { en: '{prefix}antiforeign on|off|list' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');

        const sub = (args[0] || '').toLowerCase();
        const data = load();

        if (sub === 'on') {
            data[from] = { enabled: true };
            save();
            return reply('🌍 Anti-foreign enabled. Non-Latin script messages will be deleted.');
        }
        if (sub === 'off') {
            data[from] = { enabled: false };
            save();
            return reply('Anti-foreign disabled.');
        }
        if (sub === 'list') {
            return reply('Blocked scripts: Chinese, Japanese, Korean, Arabic, Cyrillic, Thai, Bengali, Devanagari');
        }

        reply(`Anti-foreign: ${data[from]?.enabled ? 'ON ✅' : 'OFF ❌'}`);
    },

    onChat: async ({ message, from, sender, sock }) => {
        try {
            const data = load();
            if (!data[from]?.enabled) return;

            const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
            if (!text || text.length < 3) return;

            // Skip if admin
            const metadata = await sock.groupMetadata(from);
            const senderKey = sender.split(':')[0];
            const isAdmin = metadata.participants.some(p =>
                p.id === senderKey && (p.admin === 'admin' || p.admin === 'superadmin')
            );
            if (isAdmin) return;

            if (FOREIGN_PATTERNS.test(text)) {
                await sock.sendMessage(from, { delete: message.key });
                await sock.sendMessage(from, {
                    text: `🚫 @${senderKey.split('@')[0]}, only English/Latin text is allowed here.`,
                    mentions: [sender],
                });
            }
        } catch {}
    },
};
