export default {
    config: {
        name: 'randompick',
        aliases: ['randommember'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'This command can only be used in groups.',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}randompick <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!message?.isGroup) return reply('This command can only be used in groups.');
            const pick = participants[Math.floor(Math.random() * participants.length)];
            reply(`🎯 Randomly picked: @${pick.id.split('@')[0]}`);
        
    },
};
