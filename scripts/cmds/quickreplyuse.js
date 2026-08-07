export default {
    config: {
        name: 'quickreplyuse',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No quick reply called "${shortcut}". See yours with .quickreplylist',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}quickreplyuse <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const shortcut = (args[0] || '').toLowerCase();
            const data = load(fs, fsx, 'quickreplies.json');
            const message = data[sender]?.[shortcut];
            if (!message) return reply(`No quick reply called "${shortcut}". See yours with .quickreplylist`);
            reply(message);
        
    },
};
