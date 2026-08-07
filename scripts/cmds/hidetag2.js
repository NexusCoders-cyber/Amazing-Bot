export default {
    config: {
        name: 'hidetag2',
        aliases: ['htag'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Hidden tag all members',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}hidetag2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        reply({text: '📢 Hidden tag message!', mentions: []});
    },
};
