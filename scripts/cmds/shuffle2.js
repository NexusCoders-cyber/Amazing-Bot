export default {
    config: {
        name: 'shuffle2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Shuffle words',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}shuffle2' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const w = args.sort(()=>Math.random()-0.5); reply(w.join(' '));
    },
};
