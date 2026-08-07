export default {
    config: {
        name: 'urldecode',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .urldecode <encoded text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}urldecode <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .urldecode <encoded text>');
            try {
                reply(decodeURIComponent(text));
            } catch (e) {
                reply('Could not decode that text.');
            }
        
    },
};
