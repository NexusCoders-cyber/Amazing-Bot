export default {
    config: {
        name: 'bookmarkremove',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .bookmarkremove <number>nCheck numbers with .bookmarklist',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}bookmarkremove <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const idx = parseInt(args[0]) - 1;
            const data = load(fs, fsx, 'bookmarks.json');
            const marks = data[sender] || [];
            if (isNaN(idx) || !marks[idx]) return reply('Usage: .bookmarkremove <number>\nCheck numbers with .bookmarklist');
            const removed = marks.splice(idx, 1);
            save(fs, 'bookmarks.json', data);
            reply(`🗑️ Removed bookmark: "${removed[0].label}"`);
        
    },
};
