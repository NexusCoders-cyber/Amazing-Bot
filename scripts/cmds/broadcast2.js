import { isDev } from '../../src/utils/devAccess.js';

export default {
    config: {
        name: 'broadcast',
        aliases: ['bc'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Broadcast message to all groups (dev only)',
        category: 'owner',
        coolDown: 60,
        role: 0,
        guide: { en: '{prefix}broadcast <message>' },
    },

    async onStart({ args, reply, sock, sender, React }) {
        React('📢');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);
        if (!args.length) return reply(`Usage: {prefix}broadcast <message>`);

        const text = args.join(' ');
        try {
            const groups = await sock.groupFetchAllParticipating();
            const entries = Object.entries(groups);
            let sent = 0, failed = 0;

            for (const [id, g] of entries) {
                try {
                    await sock.sendMessage(id, {
                        text: `📢 *BROADCAST*\n━━━━━━━━━━━━━━━━━━━━\n\n${text}\n\n━━━━━━━━━━━━━━━━━━━━\n_Sent to ${g.subject || 'group'}_`,
                    });
                    sent++;
                    await new Promise(r => setTimeout(r, 1000)); // Rate limit
                } catch { failed++; }
            }

            reply(`📢 *Broadcast Complete*\n✅ Sent: ${sent}\n❌ Failed: ${failed}\n📊 Total: ${entries.length}`);
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
