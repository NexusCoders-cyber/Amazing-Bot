export default {
    config: {
        name: 'trunc',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Truncate text',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}trunc' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const n = parseInt(args[0])||100; const t = args.slice(1).join(' '); reply(t.length>n?t.substring(0,n)+'...':t);
    },
};
