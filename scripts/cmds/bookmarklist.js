export default {
    config: {
        name: 'bookmarklist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No bookmarks saved. Add one with .bookmarksave <url> [label]',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}bookmarklist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'bookmarks.json');
            const marks = data[sender] || [];
            if (!marks.length) return reply('No bookmarks saved. Add one with .bookmarksave <url> [label]');
            reply(`🔖 *Your Bookmarks*\n\n${marks.map((b, i) => `${i + 1}. ${b.label}\n   ${b.url}`).join('\n')}`);
        
    },
};
