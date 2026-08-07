export default {
    config: {
        name: 'base32decode',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .base32decode <base32 string>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}base32decode <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .base32decode <base32 string>');
            try {
                reply(base32Decode(text).toString('utf8'));
            } catch (e) {
                reply('Could not decode that as Base32.');
            }
        
    },
};
