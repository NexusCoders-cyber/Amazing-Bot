export default {
    config: {
        name: 'countwords',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .countwords <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}countwords <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .countwords <text>');
            const words = text.trim().split(/\s+/).filter(Boolean);
            reply(`📝 Words: ${words.length}\nCharacters: ${text.length}\nCharacters (no spaces): ${text.replace(/\s/g, '').length}`);
        
    },
};
