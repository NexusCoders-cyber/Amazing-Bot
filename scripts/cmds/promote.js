export default {
    config: { name: 'promote', aliases: ['makeadmin', 'admin'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Promote a member to group admin', category: 'admin', coolDown: 3, role: 1,
        guide: { en: '{prefix}promote @user' } },
    async onStart({ sock, message, from, sender, reply, isGroup, isGroupAdmin, isBotAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        if (!isBotAdmin) return reply('I need to be admin.');
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const target = ctx?.participant || ctx?.mentionedJid?.[0];
        if (!target) return reply('Reply to or mention someone to promote.');
        try {
            await sock.groupParticipantsUpdate(from, [target], 'promote');
            reply(`@${target.split('@')[0]} has been promoted to admin.`);
        } catch { reply('Failed to promote.'); }
    },
};
