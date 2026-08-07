import axios from 'axios';
import { downloadContentFromMessage } from '@whiskeysockets/baileys';

export default {
    config: {
        name: 'enhance',
        aliases: ['upscale', 'hd', 'quality'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Enhance/upscale image quality',
        category: 'edit',
        coolDown: 20,
        role: 0,
        guide: { en: '{prefix}enhance — reply to an image' },
    },
    async onStart({ message, reply, sock, from }) {
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const quoted = ctx?.quotedMessage;
        const img = quoted?.imageMessage || message.message?.imageMessage;
        if (!img) return reply('Reply to an image to enhance it.');

        try {
            const stream = await downloadContentFromMessage(img, 'image');
            const chunks = [];
            for await (const c of stream) chunks.push(c);
            const buffer = Buffer.concat(chunks);

            // Try replicate API if available
            if (process.env.REPLICATE_API_TOKEN) {
                const { data: prediction } = await axios.post(
                    'https://api.replicate.com/v1/predictions',
                    {
                        version: 'c75db81db6cbd809d93b2f4ba35771f401543fc4f05991138609c90a51de6e4f',
                        input: { image: `data:image/png;base64,${buffer.toString('base64')}` },
                    },
                    {
                        headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`, 'Content-Type': 'application/json' },
                        timeout: 60000,
                    }
                );

                // Poll for result
                let result = prediction;
                while (result.status !== 'succeeded' && result.status !== 'failed') {
                    await new Promise(r => setTimeout(r, 2000));
                    const { data } = await axios.get(result.urls?.get || result.url, {
                        headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` },
                    });
                    result = data;
                }

                if (result.status === 'succeeded' && result.output) {
                    const { data: enhanced } = await axios.get(result.output, { responseType: 'arraybuffer', timeout: 30000 });
                    await sock.sendMessage(from, {
                        image: Buffer.from(enhanced),
                        caption: '✨ Enhanced image',
                    }, { quoted: message });
                    return;
                }
            }

            // Fallback: use free upscaler API
            const formData = new FormData();
            formData.append('file', buffer, { filename: 'image.png', contentType: 'image/png' });

            const { data } = await axios.post('https://api.imgupscaler.com/api/v1/realsharp', formData, {
                timeout: 60000,
            });

            if (data?.result_url) {
                const { data: enhanced } = await axios.get(data.result_url, { responseType: 'arraybuffer', timeout: 30000 });
                await sock.sendMessage(from, {
                    image: Buffer.from(enhanced),
                    caption: '✨ Enhanced image',
                }, { quoted: message });
            } else {
                reply('Enhancement service unavailable. Try later.');
            }
        } catch (err) {
            reply('Enhancement failed. The image might be too large or the service is down.');
        }
    },
};
