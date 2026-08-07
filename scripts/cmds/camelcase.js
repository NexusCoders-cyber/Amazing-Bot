export default {
    config: {
        name: 'camelcase',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .camelcase <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}camelcase <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .camelcase <text>');
            const words = text.split(/[\s_-]+/).filter(Boolean);
            const result = words.map((w, i) => i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()).join('');
            reply(result);
        
    },
};
