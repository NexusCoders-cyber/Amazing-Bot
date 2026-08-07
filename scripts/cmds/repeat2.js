export default {
    config: {
        name: 'repeat2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Repeat text N times',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}repeat2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const n = Math.min(parseInt(args[0])||1, 100); const t = args.slice(1).join(' '); if(!t) return reply('Usage: .repeat <count> <text>'); reply(t.repeat(n));
    },
};
