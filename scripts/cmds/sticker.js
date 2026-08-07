import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';

async function downloadMedia(message) {
    const msg = message?.message;
    const ctx = message?.message?.extendedTextMessage?.contextInfo;
    const quotedMsg = ctx?.quotedMessage;

    const target = quotedMsg || msg;
    if (!target) return { buffer: null, type: null };

    const type = ['imageMessage', 'videoMessage', 'stickerMessage'].find(k => target[k]);
    if (!type) return { buffer: null, type: null };

    try {
        const stream = await downloadContentFromMessage(
            quotedMsg ? quotedMsg[type] : msg[type],
            type.replace('Message', '')
        );
        const chunks = [];
        for await (const c of stream) chunks.push(c);
        return { buffer: Buffer.concat(chunks), type };
    } catch { return { buffer: null, type: null }; }
}

export default {
    config: {
        name: 'sticker',
        aliases: ['s', 'stiker'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Convert image or video to sticker',
        category: 'media',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}sticker [pack name] - send or reply to image/video' },
    },

    async onStart({ sock, message, from, args, reply }) {
        const { buffer, type } = await downloadMedia(message);

        if (!buffer) return reply('Send or reply to an image or video to create a sticker.');
        if (type === 'videoMessage' && buffer.length > 2 * 1024 * 1024) {
            return reply('Video too large. Max 2MB for video stickers.');
        }

        try {
            const packName = args.join(' ') || 'AmazingBot';
            const authorName = 'Broken_vzn';
            const mediaType = type === 'videoMessage' ? StickerTypes.ROUNDED : StickerTypes.DEFAULT;

            const sticker = new Sticker(buffer, {
                pack: packName,
                author: authorName,
                type: mediaType,
                id: '12345',
                quality: 80,
            });

            const stickerBuffer = await sticker.toBuffer();
            await sock.sendMessage(from, { sticker: stickerBuffer }, { quoted: message });
        } catch (err) {
            reply('Could not create sticker: ' + err.message);
        }
    },
};
