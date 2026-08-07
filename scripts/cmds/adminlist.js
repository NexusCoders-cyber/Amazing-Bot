export default {
    config: {
        name: 'adminlist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'This command can only be used in groups.',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}adminlist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!message?.isGroup) return reply('This command can only be used in groups.');
            const admins = participants.filter(p => p.admin);
            if (!admins.length) return reply('No admins found.');
            const list = admins.map((p, i) => `${i + 1}. ${p.id.split('@')[0]} (${p.admin})`).join('\n');
            reply(`👑 *Admins:*\n${list}`);
        
    },
};
