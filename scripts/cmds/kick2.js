export default {
    config: {
        name: 'kick2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Kick a user',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}kick2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const t = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if(!t) return reply('Mention a user to kick'); reply(`👢 Kicking @${t.split('@')[0]}...`, {mentions:[t]});
    },
};
