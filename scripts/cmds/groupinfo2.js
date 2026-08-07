export default {
    config: {
        name: 'groupinfo2',
        aliases: ['ginfo'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get group info',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}groupinfo2' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        reply(`📊 *Group Info*\n\n👥 Name: Group Chat\n🆔 ${from}\nℹ️ Use the built-in groupinfo command for details.`);
    },
};
