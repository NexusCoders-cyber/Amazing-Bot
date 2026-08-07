import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import fs from 'fs-extra';
import path from 'path';

const FILE = path.join(process.cwd(), 'data', 'stickerVault.json');
let _data = null;

function load() { if (_data) return _data; try { _data = fs.readJsonSync(FILE); } catch { _data = []; } return _data; }
function save(data) { _data = data; fs.ensureDirSync(path.dirname(FILE)); fs.writeJsonSync(FILE, _data, { spaces: 2 }); }

export default {
    config: {
        name: 'stickerVault',
        aliases: ['sv', 'stickerstore', 'my stickers'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Save and retrieve stickers',
        category: 'utility',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}stickerVault save <name> | {prefix}stickerVault get <name> | {prefix}stickerVault list' },
    },
    async onStart({ args, sender, from, message, reply, sock }) {
        const sub = (args[0] || '').toLowerCase();
        const vault = load();

        if (sub === 'save') {
            const name = args.slice(1).join(' ');
            if (!name) return reply('Provide a name.\nUsage: stickerVault save <name>');

            const ctx = message.message?.extendedTextMessage?.contextInfo;
            const quoted = ctx?.quotedMessage;
            const sticker = quoted?.stickerMessage;
            if (!sticker) return reply('Reply to a sticker to save it.');

            try {
                const stream = await downloadContentFromMessage(sticker, 'sticker');
                const chunks = [];
                for await (const c of stream) chunks.push(c);
                const buffer = Buffer.concat(chunks);

                vault.push({
                    name: name.toLowerCase(),
                    owner: sender,
                    data: buffer.toString('base64'),
                    savedAt: new Date().toISOString(),
                });
                save(vault);
                reply(`✅ Sticker saved as "${name}"`);
            } catch (err) {
                reply('Failed to save sticker: ' + err.message);
            }
            return;
        }

        if (sub === 'get') {
            const name = args.slice(1).join(' ').toLowerCase();
            if (!name) return reply('Provide a name.\nUsage: stickerVault get <name>');

            const entry = vault.find(e => e.name === name && e.owner === sender);
            if (!entry) return reply('Sticker not found in your vault.');

            const buffer = Buffer.from(entry.data, 'base64');
            await sock.sendMessage(from, { sticker: buffer }, { quoted: message });
            return;
        }

        if (sub === 'list') {
            const myStickers = vault.filter(e => e.owner === sender);
            if (!myStickers.length) return reply('Your vault is empty. Save a sticker first!');

            const list = myStickers.map((e, i) => `${i + 1}. ${e.name}`).join('\n');
            return reply(`📦 *Your Sticker Vault*\n\n${list}`);
        }

        if (sub === 'delete') {
            const name = args.slice(1).join(' ').toLowerCase();
            if (!name) return reply('Provide a name.\nUsage: stickerVault delete <name>');

            const idx = vault.findIndex(e => e.name === name && e.owner === sender);
            if (idx === -1) return reply('Sticker not found.');
            vault.splice(idx, 1);
            save(vault);
            reply(`🗑️ Sticker "${name}" deleted from vault.`);
            return;
        }

        reply([
            `📦 *Sticker Vault*`,
            '',
            `save <name>  — Save replied sticker`,
            `get <name>   — Send saved sticker`,
            `list         — List your stickers`,
            `delete <name> — Delete a sticker`,
        ].join('\n'));
    },
};
