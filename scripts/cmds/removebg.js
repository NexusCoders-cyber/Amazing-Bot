import axios from 'axios';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export default {
    config: {
        name: 'removebg',
        aliases: ['rmbg', 'nobg'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Remove background from image',
        category: 'edit',
        coolDown: 15,
        role: 0,
        guide: { en: '{prefix}removebg — reply to an image (needs REMOVEBG_API_KEY)' },
    },
    async onStart({ message, reply, sock, from }) {
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const quoted = ctx?.quotedMessage;
        const img = quoted?.imageMessage || message.message?.imageMessage;
        if (!img) return reply('Reply to an image to remove its background.');

        const apiKey = process.env.REMOVEBG_API_KEY;
        if (!apiKey) return reply('remove.bg API key not configured. Owner needs to set REMOVEBG_API_KEY.');

        try {
            const stream = await downloadContentFromMessage(img, 'image');
            const chunks = [];
            for await (const c of stream) chunks.push(c);
            const buffer = Buffer.concat(chunks);

            const formData = new FormData();
            formData.append('image_file', buffer, { filename: 'image.png', contentType: 'image/png' });
            formData.append('size', 'auto');

            const { data } = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
                headers: { 'X-Api-Key': apiKey, ...formData.getHeaders?.() || {} },
                responseType: 'arraybuffer',
                timeout: 30000,
            });

            await sock.sendMessage(from, {
                image: Buffer.from(data),
                caption: '✂️ Background removed!',
            }, { quoted: message });
        } catch (err) {
            reply('Failed to remove background. ' + (err.response?.status === 402 ? 'API quota exceeded.' : 'Try another image.'));
        }
    },
};
