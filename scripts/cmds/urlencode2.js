export default {
    config: {
        name: 'urlencode2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'URL encode text',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}urlencode2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        reply(`🔗 ${encodeURIComponent(args.join(' '))}`);
    },
};
