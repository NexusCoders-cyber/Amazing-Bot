export default {
    config: {
        name: 'lower',
        aliases: ['lowercase'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .lower <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}lower <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .lower <text>');
            reply(text.toLowerCase());
        
    },
};
