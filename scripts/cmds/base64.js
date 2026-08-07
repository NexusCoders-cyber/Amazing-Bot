export default {
    config: {
        name: 'base64',
        aliases: ['b64', 'encode64'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Base64 encode/decode text',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}base64 encode|decode <text>' },
    },
    async onStart({ args, message, reply }) {
        const sub = (args[0] || '').toLowerCase();
        let text = args.slice(1).join(' ');

        if (!text) {
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation
                || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;
            if (quoted) text = quoted;
        }

        if (!text || !['encode', 'decode', 'enc', 'dec'].includes(sub)) {
            return reply('Usage: base64 encode|decode <text>\nOr reply to a message.');
        }

        try {
            if (sub === 'encode' || sub === 'enc') {
                const result = Buffer.from(text).toString('base64');
                reply(`🔐 *Base64 Encoded:*\n\`\`\`${result}\`\`\``);
            } else {
                const result = Buffer.from(text, 'base64').toString('utf-8');
                reply(`🔓 *Base64 Decoded:*\n${result}`);
            }
        } catch {
            reply('Invalid input for decoding.');
        }
    },
};
