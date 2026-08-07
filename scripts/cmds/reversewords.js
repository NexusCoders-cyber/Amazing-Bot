export default {
    config: {
        name: 'reversewords',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .reversewords <sentence>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}reversewords <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .reversewords <sentence>');
            reply(text.split(' ').reverse().join(' '));
        
    },
};
