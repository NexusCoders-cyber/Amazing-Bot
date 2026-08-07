export default {
    config: {
        name: 'random2',
        aliases: ['rand'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Random number between range',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}random2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const [min,max] = args.map(Number); const lo = min||1, hi = max||100; reply(`🎲 Random: *${Math.floor(Math.random()*(hi-lo+1))+lo}*`);
    },
};
