export default {
    config: {
        name: 'snakecase',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .snakecase <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}snakecase <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .snakecase <text>');
            reply(text.split(/[\s-]+/).filter(Boolean).join('_').toLowerCase());
        
    },
};
