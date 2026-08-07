export default {
    config: {
        name: 'linkgc2',
        aliases: ['grouplink'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get group invite link',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}linkgc2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        reply('🔗 Group link: (implementation requires sock API)');
    },
};
