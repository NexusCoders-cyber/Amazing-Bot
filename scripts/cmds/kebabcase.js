export default {
    config: {
        name: 'kebabcase',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .kebabcase <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}kebabcase <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .kebabcase <text>');
            reply(text.split(/[\s_]+/).filter(Boolean).join('-').toLowerCase());
        
    },
};
