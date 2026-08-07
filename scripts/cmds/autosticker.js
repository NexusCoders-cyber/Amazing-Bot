import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'autosticker.json');
let _data = null;

function load() { if (_data) return _data; try { _data = fs.readJsonSync(FILE); } catch { _data = {}; } return _data; }
function save() { fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _data, { spaces: 2 }); }

export default {
    config: {
        name: 'autosticker',
        aliases: ['autostiker', 'autos'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Auto-convert images to stickers',
        category: 'admin',
        coolDown: 5,
        role: 1,
        guide: { en: '{prefix}autosticker on|off' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');

        const sub = (args[0] || '').toLowerCase();
        const data = load();

        if (sub === 'on') {
            data[from] = { enabled: true };
            save();
            return reply('🖼️ Auto-sticker enabled! All images will be converted to stickers.');
        }
        if (sub === 'off') {
            data[from] = { enabled: false };
            save();
            return reply('Auto-sticker disabled.');
        }

        reply(`Auto-sticker: ${data[from]?.enabled ? 'ON ✅' : 'OFF ❌'}`);
    },

    // onChat handler: auto-convert images to stickers
    onChat: async ({ message, from, sock }) => {
        try {
            const data = load();
            if (!data[from]?.enabled) return;

            const img = message.message?.imageMessage;
            if (!img) return;

            const { downloadContentFromMessage } = await import('@whiskeysockets/baileys');
            const { Sticker, StickerTypes } = await import('wa-sticker-formatter');

            const stream = await downloadContentFromMessage(img, 'image');
            const chunks = [];
            for await (const c of stream) chunks.push(c);
            const buffer = Buffer.concat(chunks);

            const sticker = new Sticker(buffer, {
                pack: 'AmazingBot',
                author: 'Auto',
                type: StickerTypes.DEFAULT,
                quality: 70,
            });

            const stickerBuffer = await sticker.toBuffer();
            await sock.sendMessage(from, { sticker: stickerBuffer });
        } catch {}
    },
};
