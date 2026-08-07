export default {
    config: {
        name: 'gname',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Change group name',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}gname <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const n = args.join(' '); if(!n) return reply('Usage: .gname <name>'); reply(`📝 Group name changed to: *${n}*`);
    },
};
