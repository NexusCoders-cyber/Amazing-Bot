export default {
    config: {
        name: 'unbinary',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Convert binary to text',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}unbinary <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        try { reply(args.join(' ').split(' ').map(b=>String.fromCharCode(parseInt(b,2))).join('')); } catch { reply('❌ Invalid binary'); }
    },
};
