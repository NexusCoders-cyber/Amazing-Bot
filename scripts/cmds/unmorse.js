export default {
    config: {
        name: 'unmorse',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .unmorse <morse code, space separated>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}unmorse <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .unmorse <morse code, space separated>');
            const out = text.split(' ').map(c => reverseMorse[c] || c).join('');
            reply(out);
        
    },
};
