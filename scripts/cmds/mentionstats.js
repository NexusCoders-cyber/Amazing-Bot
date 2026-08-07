export default {
    config: {
        name: 'mentionstats',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'This command can only be used in groups.',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}mentionstats <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!isGroup) return reply('This command can only be used in groups.');
            const mentioned = message?.mentionedJid || [];
            if (!mentioned.length) return reply('Mention some people first, e.g. .mentionstats @user1 @user2');
            reply(`📌 You mentioned ${mentioned.length} user(s) in this message.`);
        
    },
};
