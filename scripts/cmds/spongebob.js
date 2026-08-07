export default {
    config: {
        name: 'spongebob',
        aliases: ['mockingcase'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .spongebob <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}spongebob <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .spongebob <text>');
            reply(text.split('').map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(''));
        
    },
};
