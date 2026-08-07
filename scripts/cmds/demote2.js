export default {
    config: {
        name: 'demote2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Demote from admin',
        category: 'admin',
        groupOnly: true,
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}demote2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const t = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if(!t) return reply('Mention a user to demote'); reply(`⬇️ Demoting @${t.split('@')[0]}...`, {mentions:[t]});
    },
};
