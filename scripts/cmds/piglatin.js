export default {
    config: {
        name: 'piglatin',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .piglatin <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}piglatin <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .piglatin <text>');
            const toPig = w => /^[aeiouAEIOU]/.test(w) ? w + 'way' : w.slice(1) + w[0] + 'ay';
            reply(text.split(' ').map(toPig).join(' '));
        
    },
};
