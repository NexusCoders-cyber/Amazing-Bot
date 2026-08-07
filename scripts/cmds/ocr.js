import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export default {
    config: {
        name: 'ocr',
        aliases: ['readtext', 'extracttext'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Extract text from image (OCR)',
        category: 'fun',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}ocr — reply to an image' },
    },
    async onStart({ message, reply }) {
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const quoted = ctx?.quotedMessage;
        const img = quoted?.imageMessage || message.message?.imageMessage;
        if (!img) return reply('Reply to an image to extract text.');

        try {
            const stream = await downloadContentFromMessage(img, 'image');
            const chunks = [];
            for await (const c of stream) chunks.push(c);
            const buffer = Buffer.concat(chunks);

            // Placeholder — requires a vision/OCR API key in env
            if (process.env.OCR_API_KEY) {
                // Example: use ocr.space or Google Vision
                reply('OCR API integration requires configuration. Set OCR_API_KEY in .env');
            } else {
                reply('OCR is not configured yet. The bot owner needs to set up a vision API key.');
            }
        } catch (err) {
            reply('Failed to process image: ' + err.message);
        }
    },
};
