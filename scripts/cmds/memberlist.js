export default {
    config: {
        name: 'memberlist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'This command can only be used in groups.',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}memberlist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!message?.isGroup) return reply('This command can only be used in groups.');
            const list = participants.map((p, i) => `${i + 1}. ${p.id.split('@')[0]}`).join('\n');
            reply(`👥 *Members (${participants.length}):*\n${list}`);
        
    },
};
