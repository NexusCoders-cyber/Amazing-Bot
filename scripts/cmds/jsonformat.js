export default {
    config: {
        name: 'jsonformat',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .jsonformat <json string>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}jsonformat <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .jsonformat <json string>');
            try {
                const parsed = JSON.parse(text);
                reply('```' + JSON.stringify(parsed, null, 2) + '```');
            } catch (e) {
                reply('Invalid JSON: ' + e.message);
            }
        
    },
};
