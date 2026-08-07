export default {
    config: {
        name: 'charcount',
        aliases: ['chars', 'charlen', 'wordcount'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Count characters, words, and lines',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}charcount <text>' },
    },
    async onStart({ args, message, reply }) {
        let text = args.join(' ');
        if (!text) {
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation
                || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;
            if (quoted) text = quoted;
        }
        if (!text) return reply('Provide text or reply to a message.');

        const chars = text.length;
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        const lines = text.split('\n').length;
        const noSpaces = text.replace(/\s/g, '').length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;

        reply([
            `📊 *Character Count*`,
            '',
            `Characters (total) : ${chars}`,
            `Characters (no sp) : ${noSpaces}`,
            `Words              : ${words}`,
            `Lines              : ${lines}`,
            `Sentences          : ${sentences}`,
        ].join('\n'));
    },
};
