export default {
    config: {
        name: 'unmuteall',
        aliases: ['unmutegroup', 'unmuteeveryone'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Unmute the group — everyone can chat again',
        category: 'admin',
        coolDown: 10,
        role: 1,
        guide: { en: '{prefix}unmuteall' },
    },
    async onStart({ from, reply, isGroup, isGroupAdmin, isBotAdmin, sock }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        if (!isBotAdmin) return reply('Bot needs to be admin.');

        try {
            await sock.groupSettingUpdate(from, 'not_announcement');
            reply('🔊 Group unmuted. Everyone can send messages again.');
        } catch (err) {
            reply('Failed to unmute: ' + err.message);
        }
    },
};
