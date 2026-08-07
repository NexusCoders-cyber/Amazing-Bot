export default {
    config: {
        name: 'jsonminify',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .jsonminify <json string>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}jsonminify <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .jsonminify <json string>');
            try {
                const parsed = JSON.parse(text);
                reply(JSON.stringify(parsed));
            } catch (e) {
                reply('Invalid JSON: ' + e.message);
            }
        
    },
};
