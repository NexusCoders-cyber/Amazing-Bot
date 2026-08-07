export default {
    config: {
        name: 'bookmarksave',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .bookmarksave <url> [label]nExample: .bookmarksave https://example.com C',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}bookmarksave <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .bookmarksave <url> [label]\nExample: .bookmarksave https://example.com Cool article');
            const url = args[0];
            const label = args.slice(1).join(' ') || url;
            const data = load(fs, fsx, 'bookmarks.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ url, label });
            save(fs, 'bookmarks.json', data);
            reply(`🔖 Bookmarked: "${label}"`);
        
    },
};
