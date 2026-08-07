export default {
    config: {
        name: 'block',
        aliases: [],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Block a user',
        category: 'owner',
        coolDown: 5,
        role: 2,
        guide: { en: '{prefix}block @user' },
    },

    async onStart({ message, reply, sender, from, isOwner, React }) {
        React('🚫');
        if (!isOwner) return reply(`❌ Owner only!`);

        const mentions = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (!mentions.length) return reply(`Mention a user to block.\nUsage: {prefix}block @user`);

        const target = mentions[0];
        try {
            await reply(`🚫 Blocking @${target.split('@')[0]}...`, { mentions: [target] });
        } catch {
            reply(`❌ Failed to block user.`);
        }
    },
};
