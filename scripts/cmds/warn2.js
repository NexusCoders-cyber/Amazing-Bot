export default {
    config: {
        name: 'warn2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Warn user',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}warn2' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const t = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if(!t) return reply('Mention a user'); reply(`⚠️ *WARNING*\n@${t.split('@')[0]} has been warned!`, {mentions:[t]});
    },
};
