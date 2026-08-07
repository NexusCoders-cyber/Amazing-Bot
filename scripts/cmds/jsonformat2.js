export default {
    config: {
        name: 'jsonformat2',
        aliases: ['jf'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Format JSON',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}jsonformat2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        try { const j = JSON.parse(args.join(' ')); reply(JSON.stringify(j, null, 2)); } catch { reply('❌ Invalid JSON'); }
    },
};
