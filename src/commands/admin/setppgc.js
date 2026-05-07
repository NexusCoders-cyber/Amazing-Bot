import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
    name: 'setppgc',
    aliases: ['setgcpp', 'setgroupdp'],
    category: 'admin',
    description: 'Set group profile picture by replying to an image',
    usage: 'setppgc (reply image)',
    groupOnly: true,
    adminOnly: true,
    botAdminRequired: true,

    async execute({ sock, message, from }) {
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const quoted = ctx?.quotedMessage;
        const imageMsg = quoted?.imageMessage;

        if (!imageMsg) {
            return await sock.sendMessage(from, { text: '❌ Reply to an image with .setppgc' }, { quoted: message });
        }

        try {
            const buffer = await downloadMediaMessage(
                {
                    message: { imageMessage: imageMsg },
                    key: { remoteJid: from, id: ctx.stanzaId, participant: ctx.participant }
                },
                'buffer',
                {}
            );

            await sock.updateProfilePicture(from, buffer);
            await sock.sendMessage(from, { text: '✅ Group profile photo updated.' }, { quoted: message });
        } catch (error) {
            await sock.sendMessage(from, {
                text: `❌ Failed to update group photo: ${error.message}`
            }, { quoted: message });
        }
    }
};
