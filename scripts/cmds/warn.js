export default {
    config: {
        name: 'warn',
        aliases: ['warnuser'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Warn a user',
        category: 'admin',
        coolDown: 5,
        role: 1,
        groupOnly: true,
        guide: { en: '{prefix}warn @user <reason>' },
    },

    async onStart({ args, message, reply, sender, isGroup, isGroupAdmin, isBotAdmin, isOwner, prefix, React }) {
        React('⚠️');
        if (!isGroup) return reply(`Group only command!`);
        if (!isGroupAdmin && !isOwner) return reply(`❌ Admin only!`);

        const mentions = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (!mentions.length) return reply(`Mention a user to warn.\nUsage: ${prefix}warn @user <reason>`);

        const target = mentions[0];
        const reason = args.filter(a => !a.startsWith('@')).join(' ') || 'No reason provided';

        reply([
            `━━━━━━━━━━━━━━━━━━━━`,
            `  ⚠️ *WARNING*`,
            `━━━━━━━━━━━━━━━━━━━━`,
            ``,
            `  🎯 Target: @${target.split('@')[0]}`,
            `  📝 Reason: ${reason}`,
            `  👤 Warned by: @${sender.split('@')[0]}`,
            ``,
            `  ⚠️ 3 warnings = kick`,
            `━━━━━━━━━━━━━━━━━━━━`,
        ].join('\n'), { mentions: [target, sender] });
    },
};
