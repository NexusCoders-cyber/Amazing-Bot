export default {
    config: {
        name: 'unblock',
        aliases: [],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Unblock a user',
        category: 'owner',
        coolDown: 5,
        role: 2,
        guide: { en: '{prefix}unblock @user' },
    },

    async onStart({ message, reply, isOwner, React }) {
        React('✅');
        if (!isOwner) return reply(`❌ Owner only!`);

        const mentions = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (!mentions.length) return reply(`Mention a user to unblock.\nUsage: {prefix}unblock @user`);

        const target = mentions[0];
        try {
            await reply(`✅ Unblock request for @${target.split('@')[0]}`, { mentions: [target] });
        } catch {
            reply(`❌ Failed to unblock user.`);
        }
    },
};
