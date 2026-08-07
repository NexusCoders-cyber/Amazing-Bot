export default {
    config: {
        name: 'promote2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Promote to admin',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}promote2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const t = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if(!t) return reply('Mention a user to promote'); reply(`⬆️ Promoting @${t.split('@')[0]}...`, {mentions:[t]});
    },
};
