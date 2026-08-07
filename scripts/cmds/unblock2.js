export default {
    config: {
        name: 'unblock2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Unblock a user',
        category: 'owner',
        role: 2,
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}unblock2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const t = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if(!t) return reply('Mention a user'); reply(`✅ Unblocking @${t.split('@')[0]}`, {mentions:[t]});
    },
};
