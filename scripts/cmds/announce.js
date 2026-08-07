export default {
    config: {
        name: 'announce',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Announce to group',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}announce' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const msg = args.join(' '); if(!msg) return reply('Usage: .announce <message>'); reply(`📢 *ANNOUNCEMENT:*\n\n${msg}`);
    },
};
