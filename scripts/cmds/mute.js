export default {
    config: { name: 'mute', aliases: ['lock', 'close'], author: 'Raphael Ilom', version: '1.0',
        shortDescription: 'Mute the group (admins only can send)', category: 'admin', coolDown: 5, role: 1,
        guide: { en: '{prefix}mute' } },
    async onStart({ sock, from, reply, isGroup, isGroupAdmin, isBotAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        if (!isBotAdmin) return reply('I need admin rights.');
        try { await sock.groupSettingUpdate(from, 'announcement'); reply('Group has been muted. Only admins can send messages.'); }
        catch { reply('Failed to mute group.'); }
    },
};
