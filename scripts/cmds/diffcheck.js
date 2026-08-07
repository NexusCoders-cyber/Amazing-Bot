export default {
    config: {
        name: 'diffcheck',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .diffcheck <text1>|<text2>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}diffcheck <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text || !text.includes('|')) return reply('Usage: .diffcheck <text1>|<text2>');
            const [a, b] = text.split('|').map(s => s.trim());
            const wordsA = a.split(/\s+/);
            const wordsB = b.split(/\s+/);
            const onlyA = wordsA.filter(w => !wordsB.includes(w));
            const onlyB = wordsB.filter(w => !wordsA.includes(w));
            reply(`🔍 *Diff Check*\n\nOnly in text 1: ${onlyA.join(', ') || 'none'}\nOnly in text 2: ${onlyB.join(', ') || 'none'}`);
        
    },
};
