export default {
    config: {
        name: 'block2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Block a user',
        category: 'owner',
        role: 2,
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}block2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const t = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0]; if(!t) return reply('Mention a user'); reply(`🚫 Blocking @${t.split('@')[0]}`, {mentions:[t]});
    },
};
