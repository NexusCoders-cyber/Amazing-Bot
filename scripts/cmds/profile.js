export default {
    config: {
        name: 'profile',
        aliases: ['pp', 'dp'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'View your or someone else\'s profile',
        category: 'general',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}profile [@user]' },
    },
    async onStart({ sock, message, from, sender, reply, usersData }) {
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const target = ctx?.participant || ctx?.mentionedJid?.[0] || sender;
        const phone = target.split('@')[0].split(':')[0];
        const name = message.pushName || phone;

        let pic = null;
        try { pic = await sock.profilePictureUrl(target, 'image'); } catch {}

        let status = 'No status set';
        try { const s = await sock.fetchStatus(target); if (s?.status) status = s.status; } catch {}

        const userData = await usersData.get(phone);
        const text = [
            `Profile`,
            ``,
            `Name   : ${userData?.name || name}`,
            `Phone  : +${phone}`,
            `Status : ${status.slice(0, 60)}`,
            `Money  : ${userData?.money || 0}`,
            `EXP    : ${userData?.exp || 0}`,
        ].join('\n');

        if (pic) {
            await sock.sendMessage(from, { image: { url: pic }, caption: text, mentions: [target] }, { quoted: message });
        } else {
            await sock.sendMessage(from, { text, mentions: [target] }, { quoted: message });
        }
    },
};
