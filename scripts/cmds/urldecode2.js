export default {
    config: {
        name: 'urldecode2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'URL decode text',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}urldecode2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        try { reply(decodeURIComponent(args.join(' '))); } catch { reply('❌ Invalid URL encoding'); }
    },
};
