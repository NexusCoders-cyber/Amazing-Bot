export default {
    config: {
        name: 'urlencode',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .urlencode <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}urlencode <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .urlencode <text>');
            reply(encodeURIComponent(text));
        
    },
};
