export default {
    config: {
        name: 'speed',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Calculate speed',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}speed <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const [dist,time] = args.map(Number); if(!dist||!time) return reply('Usage: .speed <distance> <time>'); reply(`🚗 *${(dist/time).toFixed(2)} km/h*`);
    },
};
