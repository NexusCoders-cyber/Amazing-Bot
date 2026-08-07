export default {
    config: {
        name: 'quickreplysave',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .quickreplysave <shortcut> <message>nExample: .quickreplysave busy "Sorr',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}quickreplysave <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .quickreplysave <shortcut> <message>\nExample: .quickreplysave busy "Sorry, in a meeting right now, will call back!"');
            const shortcut = args[0].toLowerCase();
            const message = args.slice(1).join(' ');
            const data = load(fs, fsx, 'quickreplies.json');
            if (!data[sender]) data[sender] = {};
            data[sender][shortcut] = message;
            save(fs, 'quickreplies.json', data);
            reply(`💬 Saved quick reply "${shortcut}"`);
        
    },
};
