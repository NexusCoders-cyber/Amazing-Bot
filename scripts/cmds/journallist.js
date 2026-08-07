export default {
    config: {
        name: 'journallist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No journal entries yet. Add one with .journaladd <text>',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}journallist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'journal.json');
            const entries = data[sender] || [];
            if (!entries.length) return reply('No journal entries yet. Add one with .journaladd <text>');
            const count = Math.min(parseInt(args[0]) || 5, entries.length);
            const recent = entries.slice(-count).reverse();
            const out = recent.map(e => `[${new Date(e.date).toLocaleDateString()}] ${e.text}`).join('\n\n');
            reply(`📝 *Recent Journal Entries*\n\n${out}`);
        
    },
};
