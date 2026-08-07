export default {
    config: {
        name: 'leave2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Leave current group',
        category: 'owner',
        role: 2,
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}leave2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        reply('👋 Leaving group...');
    },
};
