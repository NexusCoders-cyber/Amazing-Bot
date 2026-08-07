export default {
    config: {
        name: 'wordcount',
        aliases: ['wc'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Count words',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}wordcount <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const t = args.join(' '); reply(`📝 Words: *${t.split(/\s+/).filter(Boolean).length}*
        📝 Characters: *${t.length}*
        📝 Sentences: *${t.split(/[.!?]+/).filter(Boolean).length}*`);
    },
};
