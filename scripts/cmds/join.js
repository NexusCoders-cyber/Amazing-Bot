function extractInviteCode(input) {
    const raw = String(input || '').trim();
    if (!raw) return null;
    if (raw.includes('chat.whatsapp.com')) {
        return raw.split('chat.whatsapp.com/').pop().split('?')[0].split('/')[0].trim() || null;
    }
    if (raw.endsWith('@g.us')) return null;
    return /^[A-Za-z0-9]{10,30}$/.test(raw) ? raw : null;
}

export default {
    config: {
        name: 'join',
        aliases: ['joingc', 'joingroup'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Make the bot join a group using its invite link',
        category: 'owner',
        coolDown: 5,
        role: 2,
        guide: { en: '.join <invite_link_or_code>' },
    },

    async onStart({ sock, args, reply }) {
        const input = args[0];
        if (!input) return reply('⚠️ Usage: .join <invite_link_or_code>\nExample: .join https://chat.whatsapp.com/AbCdEfGhIjK');

        if (input.endsWith('@g.us')) {
            return reply('🚫 WhatsApp does not allow joining a group using only its JID, for privacy reasons.\nAsk a group admin for the invite link instead: .join <invite_link>');
        }

        const code = extractInviteCode(input);
        if (!code) return reply('⚠️ That does not look like a valid WhatsApp invite link or code.');

        try {
            const result = await sock.groupAcceptInvite(code);
            const jid = typeof result === 'string' ? result : result?.gid;
            let name = jid || '';
            if (jid) {
                try { name = (await sock.groupMetadata(jid)).subject; } catch {}
            }
            reply(`✅ Successfully joined "${name || 'the group'}"!${jid ? `\n🆔 JID: ${jid}` : ''}`);
        } catch (err) {
            reply(`❌ Could not join that group.\n⚠️ ${err.message}`);
        }
    },
};
