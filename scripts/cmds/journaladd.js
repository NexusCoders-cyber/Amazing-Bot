export default {
    config: {
        name: 'journaladd',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .journaladd <entry text>nA private journal only you can see.',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}journaladd <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .journaladd <entry text>\nA private journal only you can see.');
            const data = load(fs, fsx, 'journal.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ text, date: new Date().toISOString() });
            save(fs, 'journal.json', data);
            reply('📝 Journal entry saved.');
        
    },
};
