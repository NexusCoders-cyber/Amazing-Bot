import { isDev } from '../../src/utils/devAccess.js';

export default {
    config: {
        name: 'masskick',
        aliases: ['kickall'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Kick all non-admins from group (dev only)',
        category: 'owner',
        coolDown: 60,
        role: 0,
        groupOnly: true,
        guide: { en: '{prefix}masskick' },
    },

    async onStart({ reply, sock, from, sender, isGroupAdmin, React }) {
        React('💀');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);
        if (!isGroupAdmin) return reply(`❌ Bot must be admin.`);

        try {
            const groupMeta = await sock.groupMetadata(from);
            const participants = groupMeta.participants;
            const admins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id);
            const nonAdmins = participants.filter(p => !p.admin);

            if (!nonAdmins.length) return reply(`✅ No non-admins to kick.`);

            let kicked = 0;
            for (const p of nonAdmins) {
                try {
                    await sock.groupParticipantsUpdate(from, [p.id], 'remove');
                    kicked++;
                    await new Promise(r => setTimeout(r, 500));
                } catch {}
            }

            reply(`💀 *Mass Kick Complete*\n✅ Kicked: ${kicked}/${nonAdmins.length}\n🛡️ Admins protected: ${admins.length}`);
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
