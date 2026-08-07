export default {
    config: {
        name: 'mute2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Mute group',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}mute2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        reply('🔇 Group muted for non-admins.');
    },
};
