export default {
    config: {
        name: 'base32encode',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .base32encode <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}base32encode <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .base32encode <text>');
            reply(base32Encode(Buffer.from(text, 'utf8')));
        
    },
};
