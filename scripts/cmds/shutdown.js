export default {
    config: {
        name: 'shutdown',
        aliases: ['off'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Shutdown bot',
        category: 'owner',
        role: 2,
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}shutdown <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        reply('⏻ Shutting down...').then(()=>process.exit(0));
    },
};
