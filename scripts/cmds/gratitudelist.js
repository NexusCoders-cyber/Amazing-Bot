export default {
    config: {
        name: 'gratitudelist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No gratitude entries yet. Add one with .gratitudeadd <text>',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}gratitudelist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'gratitude.json');
            const entries = (data[sender] || []).slice(-10).reverse();
            if (!entries.length) return reply('No gratitude entries yet. Add one with .gratitudeadd <text>');
            reply(`🙏 *Things You're Grateful For*\n\n${entries.map(e => `[${e.date}] ${e.text}`).join('\n')}`);
        
    },
};
