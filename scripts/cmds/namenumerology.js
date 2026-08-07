export default {
    config: {
        name: 'namenumerology',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .namenumerology <name>',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}namenumerology <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .namenumerology <name>');
            const clean = text.toLowerCase().replace(/[^a-z]/g, '');
            let sum = 0;
            for (const ch of clean) sum += ch.charCodeAt(0) - 96;
            while (sum > 9) sum = String(sum).split('').reduce((a, b) => a + parseInt(b), 0);
            const meanings = {
                1: 'Leadership and independence', 2: 'Balance and cooperation', 3: 'Creativity and expression',
                4: 'Stability and hard work', 5: 'Freedom and adventure', 6: 'Nurturing and responsibility',
                7: 'Wisdom and introspection', 8: 'Ambition and power', 9: 'Compassion and idealism'
            };
            reply(`🔢 *Numerology for "${text}"*\n\nNumber: ${sum}\nMeaning: ${meanings[sum] || 'Unique path'}`);
        
    },
};
