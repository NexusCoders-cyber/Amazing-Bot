export default {
    config: {
        name: 'strip',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Strip whitespace',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}strip' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const t = args.join(' '); reply(`Stripped: ${t.replace(/\s+/g,' ')}`);
    },
};
