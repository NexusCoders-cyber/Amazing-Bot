import axios from 'axios';

export default {
    config: {
        name: 'qrcode',
        aliases: ['qr', 'makeqr'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Generate a QR code',
        category: 'utility',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}qrcode <text or url>' },
    },
    async onStart({ args, from, reply, sock, message }) {
        if (!args.length) return reply('Usage: qrcode <text or url>');

        const text = args.join(' ');
        try {
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;
            const { data: buffer } = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });

            await sock.sendMessage(from, {
                image: Buffer.from(buffer),
                caption: `📱 QR Code for: ${text.length > 50 ? text.slice(0, 50) + '...' : text}`,
            }, { quoted: message });
        } catch (err) {
            reply('Failed to generate QR code.');
        }
    },
};
