export default {
    config: {
        name: 'muteall',
        aliases: ['mutegroup', 'muteeveryone'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Mute all non-admins in the group',
        category: 'admin',
        coolDown: 10,
        role: 1,
        guide: { en: '{prefix}muteall' },
    },
    async onStart({ from, reply, isGroup, isGroupAdmin, isBotAdmin, sock }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        if (!isBotAdmin) return reply('Bot needs to be admin.');

        try {
            const metadata = await sock.groupMetadata(from);
            const admins = metadata.participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);

            // Set group to admin-only messaging
            await sock.groupSettingUpdate(from, 'announcement');
            reply(`🔇 Group muted. Only admins can send messages.\n${admins.length} admins exempt.`);
        } catch (err) {
            reply('Failed to mute group: ' + err.message);
        }
    },
};
