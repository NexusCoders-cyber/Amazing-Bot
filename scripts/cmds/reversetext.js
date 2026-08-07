export default {
    config: {
        name: 'reversetext',
        aliases: ['textreverse'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .reversetext <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}reversetext <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .reversetext <text>');
            reply(text.split('').reverse().join(''));
        
    },
};
