export default {
    config: {
        name: 'jsontocsv',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .jsontocsv <json array>nExample: .jsontocsv [{"name":"John","age":30}]',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}jsontocsv <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .jsontocsv <json array>\nExample: .jsontocsv [{"name":"John","age":30}]');
            try {
                const data = JSON.parse(text);
                if (!Array.isArray(data) || !data.length) return reply('Please provide a non-empty JSON array of objects.');
                const headers = Object.keys(data[0]);
                const rows = data.map(obj => headers.map(h => obj[h]).join(','));
                reply('```' + [headers.join(','), ...rows].join('\n') + '```');
            } catch (e) {
                reply('Could not parse that as JSON.');
            }
        
    },
};
