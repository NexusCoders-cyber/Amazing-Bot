export default {
    config: { name: 'unmute', aliases: ['unlock', 'open'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Unmute the group', category: 'admin', coolDown: 5, role: 1,
        guide: { en: '{prefix}unmute' } },
    async onStart({ sock, from, reply, isGroup, isGroupAdmin, isBotAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        if (!isBotAdmin) return reply('I need admin rights.');
        try { await sock.groupSettingUpdate(from, 'not_announcement'); reply('Group has been unmuted. Everyone can send messages.'); }
        catch { reply('Failed to unmute group.'); }
    },
};
