export default {
    config: {
        name: 'gdesc',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Change group description',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}gdesc <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const d = args.join(' '); if(!d) return reply('Usage: .gdesc <desc>'); reply(`📝 Group description updated.`);
    },
};
