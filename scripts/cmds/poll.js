export default {
    config: {
        name: 'poll',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Create a poll',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}poll <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const [q, ...opts] = args.join('|').split('|'); if(!q||opts.length<2) return reply('Usage: .poll Question | Option1 | Option2'); reply(`📊 *Poll: ${q.trim()}*\n${opts.map((o,i)=>`${i+1}. ${o.trim()}`).join('\n')}`);
    },
};
