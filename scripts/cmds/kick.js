export default {
    config: { name: 'kick', aliases: ['remove', 'k'], author: 'Raphael Ilom', version: '1.0',
        shortDescription: 'Kick a member from the group', category: 'admin', coolDown: 3, role: 1,
        guide: { en: '{prefix}kick @user' } },
    async onStart({ sock, message, args, from, sender, reply, isGroup, isGroupAdmin, isBotAdmin }) {
        if (!isGroup) return reply('This command only works in groups.');
        if (!isGroupAdmin) return reply('You need to be a group admin to use this.');
        if (!isBotAdmin) return reply('I need admin rights to kick members.');
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const target = ctx?.participant || ctx?.mentionedJid?.[0];
        if (!target) return reply('Reply to a message or mention someone to kick.');
        if (target === sender) return reply('You cannot kick yourself.');
        try {
            await sock.groupParticipantsUpdate(from, [target], 'remove');
            reply(`@${target.split('@')[0]} has been kicked.`);
        } catch { reply('Failed to kick. Make sure I have admin rights.'); }
    },
};
