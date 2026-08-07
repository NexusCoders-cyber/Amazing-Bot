import { isDev } from '../../src/utils/devAccess.js';

export default {
    config: {
        name: 'grouplist',
        aliases: ['groups', 'glist'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'List all groups bot is in (dev only)',
        category: 'owner',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}grouplist' },
    },

    async onStart({ reply, sock, sender, React }) {
        React('📋');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);

        try {
            const groups = await sock.groupFetchAllParticipating();
            const entries = Object.entries(groups);

            let text = `━━━━━━━━━━━━━━━━━━━━\n  📋 *GROUP LIST*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
            text += `  📊 Total: *${entries.length}* groups\n\n`;

            for (const [id, g] of entries.slice(0, 50)) {
                text += `  👥 ${g.subject || 'Unknown'}\n`;
                text += `     🆔 ${id.split('@')[0]}\n`;
                text += `     👤 ${g.participants?.length || 0} members\n\n`;
            }

            if (entries.length > 50) text += `  ... and ${entries.length - 50} more\n`;
            text += `━━━━━━━━━━━━━━━━━━━━`;
            reply(text);
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
