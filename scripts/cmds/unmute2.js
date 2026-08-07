export default {
    config: {
        name: 'unmute2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Unmute group',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}unmute2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        reply('🔊 Group unmuted.');
    },
};
