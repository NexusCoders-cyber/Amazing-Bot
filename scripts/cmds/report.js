import axios from 'axios';

export default {
    config: {
        name: 'report',
        aliases: [],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Report a user to admins',
        category: 'fun',
        coolDown: 30,
        role: 0,
        groupOnly: true,
        guide: { en: '{prefix}report @user <reason>' },
    },

    async onStart({ args, reply, sender, message, isGroup, prefix, React }) {
        React('🚨');
        if (!isGroup) return reply(`This command only works in groups.`);

        const mentions = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        if (!mentions.length) return reply(`Mention a user to report!\nUsage: ${prefix}report @user <reason>`);

        const target = mentions[0];
        const reason = args.filter(a => !a.startsWith('@')).join(' ');
        if (!reason) return reply(`Provide a reason!\nUsage: ${prefix}report @user <reason>`);

        const phone = sender.replace(/[^0-9]/g, '').split(':')[0];
        const targetPhone = target.replace(/[^0-9]/g, '').split(':')[0];

        reply([
            `━━━━━━━━━━━━━━━━━━━━`,
            `  🚨 *USER REPORT*`,
            `━━━━━━━━━━━━━━━━━━━━`,
            ``,
            `  📢 Reporter: @${phone}`,
            `  🎯 Target: @${targetPhone}`,
            `  📝 Reason: ${reason}`,
            ``,
            `  ⏳ Admins will review this.`,
            `━━━━━━━━━━━━━━━━━━━━`,
        ].join('\n'), { mentions: [sender, target] });
    },
};
