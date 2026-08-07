export default {
    config: {
        name: 'titlecase',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .titlecase <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}titlecase <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .titlecase <text>');
            reply(text.replace(/\w\S*/g, w => w[0].toUpperCase() + w.slice(1).toLowerCase()));
        
    },
};
