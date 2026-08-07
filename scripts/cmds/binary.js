export default {
    config: {
        name: 'binary',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Convert text to binary',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}binary <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        reply(args.join(' ').split('').map(c=>c.charCodeAt(0).toString(2).padStart(8,'0')).join(' '));
    },
};
