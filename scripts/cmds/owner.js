export default {
    config: { name: 'owner', aliases: ['contact', 'dev', 'creator'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Get bot owner contact', category: 'general', coolDown: 10, role: 0,
        guide: { en: '{prefix}owner' } },
    async onStart({ sock, message, from, reply }) {
        const ownerNum = process.env.OWNER_NUMBER || '';
        const ownerName = process.env.OWNER_NAME || 'Broken_vzn';
        if (ownerNum) {
            const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName}\nORG:AmazingBot;\nTEL;type=CELL;type=VOICE;waid=${ownerNum}:+${ownerNum}\nEND:VCARD`;
            await sock.sendMessage(from, { contacts: { displayName: ownerName, contacts: [{ vcard }] } }, { quoted: message });
        }
        reply(`Bot Owner: ${ownerName}\nCreated by: Broken_vzn\nFor support, contact the owner.`);
    },
};
