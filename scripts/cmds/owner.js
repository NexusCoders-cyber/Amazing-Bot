import config from '../../src/config.js';

export default {
    config: { name: 'owner', aliases: ['contact', 'dev', 'creator'], author: 'Raphael Ilom', version: '1.0',
        shortDescription: 'Get bot owner contact', category: 'general', coolDown: 10, role: 0,
        guide: { en: '{prefix}owner' } },
    async onStart({ sock, message, from, reply }) {
        const ownerNum = config.ownerNumbersRaw[0] || '';
        const ownerName = config.ownerName;
        if (ownerNum) {
            const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${ownerName}\nORG:AmazingBot;\nTEL;type=CELL;type=VOICE;waid=${ownerNum}:+${ownerNum}\nEND:VCARD`;
            await sock.sendMessage(from, { contacts: { displayName: ownerName, contacts: [{ vcard }] } }, { quoted: message });
        }
        reply(`Bot Owner: ${ownerName}\nCreated by: Raphael Ilom\nFor support, contact the owner.`);
    },
};
