export default {
    config: {
        name: 'reverse',
        aliases: ['reversetext', 'flip'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Reverse text',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}reverse <text>' },
    },
    async onStart({ args, message, reply }) {
        let text = args.join(' ');
        if (!text) {
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation
                || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;
            if (quoted) text = quoted;
        }
        if (!text) return reply('Provide text to reverse.\nUsage: reverse <text>');

        const reversed = text.split('').reverse().join('');
        reply(`🔄 *Reversed:*\n${reversed}`);
    },
};
