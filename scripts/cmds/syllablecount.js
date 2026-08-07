export default {
    config: {
        name: 'syllablecount',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .syllablecount <word or sentence>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}syllablecount <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .syllablecount <word or sentence>');
            const words = text.trim().split(/\s+/);
            const countSyllables = w => {
                w = w.toLowerCase().replace(/[^a-z]/g, '');
                if (!w) return 0;
                const matches = w.match(/[aeiouy]+/g);
                let count = matches ? matches.length : 1;
                if (w.endsWith('e') && count > 1) count--;
                return Math.max(count, 1);
            };
            const total = words.reduce((sum, w) => sum + countSyllables(w), 0);
            reply(`🔤 Approximate syllable count: *${total}*`);
        
    },
};
