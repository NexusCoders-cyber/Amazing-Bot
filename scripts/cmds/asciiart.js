export default {
    config: {
        name: 'asciiart',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .asciiart <short text>nMax 10 characters.',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}asciiart <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .asciiart <short text>\nMax 10 characters.');
            const clean = text.slice(0, 10).toUpperCase();
            const bordered = `╔${'═'.repeat(clean.length + 4)}╗\n║  ${clean}  ║\n╚${'═'.repeat(clean.length + 4)}╝`;
            reply(bordered);
        
    },
};
