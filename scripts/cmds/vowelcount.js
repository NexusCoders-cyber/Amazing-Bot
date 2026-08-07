export default {
    config: {
        name: 'vowelcount',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .vowelcount <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}vowelcount <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .vowelcount <text>');
            const count = (text.match(/[aeiouAEIOU]/g) || []).length;
            reply(`🔤 Vowel count: ${count}`);
        
    },
};
