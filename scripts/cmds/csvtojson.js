export default {
    config: {
        name: 'csvtojson',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .csvtojson <csv text>nExample: .csvtojson name,agenJohn,30nJane,25n',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}csvtojson <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .csvtojson <csv text>\nExample: .csvtojson name,age\\nJohn,30\\nJane,25\n(use literal newlines in the message)');
            try {
                const lines = text.trim().split('\n').map(l => l.split(',').map(c => c.trim()));
                const headers = lines[0];
                const rows = lines.slice(1).map(row => {
                    const obj = {};
                    headers.forEach((h, i) => obj[h] = row[i]);
                    return obj;
                });
                reply('```' + JSON.stringify(rows, null, 2) + '```');
            } catch (e) {
                reply('Could not parse that as CSV.');
            }
        
    },
};
