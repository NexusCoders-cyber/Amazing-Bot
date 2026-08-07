export default {
    config: {
        name: 'upper',
        aliases: ['uppercase'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .upper <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}upper <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .upper <text>');
            reply(text.toUpperCase());
        
    },
};
