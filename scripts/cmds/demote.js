export default {
    config: { name: 'demote', aliases: ['removeadmin', 'unadmin'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Remove admin rights from a member', category: 'admin', coolDown: 3, role: 1,
        guide: { en: '{prefix}demote @user' } },
    async onStart({ sock, message, from, sender, reply, isGroup, isGroupAdmin, isBotAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        if (!isBotAdmin) return reply('I need to be admin.');
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const target = ctx?.participant || ctx?.mentionedJid?.[0];
        if (!target) return reply('Reply to or mention someone to demote.');
        if (target === sender) return reply('You cannot demote yourself.');
        try {
            await sock.groupParticipantsUpdate(from, [target], 'demote');
            reply(`@${target.split('@')[0]} has been demoted.`);
        } catch { reply('Failed to demote.'); }
    },
};
