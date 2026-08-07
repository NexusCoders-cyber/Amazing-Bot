import axios from 'axios';

export default {
    config: {
        name: 'imagegen',
        aliases: ['imggen', 'generate', 'imagine'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Generate images using AI',
        category: 'ai',
        coolDown: 15,
        role: 0,
        guide: { en: '{prefix}imagegen <prompt>' },
    },
    async onStart({ args, from, reply, sock, message }) {
        if (!args.length) return reply('Describe what to generate!\nUsage: imagegen <prompt>');

        const prompt = args.join(' ');
        const encoded = encodeURIComponent(prompt);

        try {
            // Pollinations.ai — free, no API key
            const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&nologo=true&seed=${Math.floor(Math.random() * 99999)}`;

            const { data: imgBuffer } = await axios.get(url, {
                responseType: 'arraybuffer',
                timeout: 60000,
            });

            await sock.sendMessage(from, {
                image: Buffer.from(imgBuffer),
                caption: `🖼️ *${prompt}*`,
            }, { quoted: message });
        } catch (err) {
            reply('Image generation failed. Try a simpler prompt.');
        }
    },
};
