export default {
    name: 'setpp',
    aliases: ['setbotpp', 'changebotpp', 'updatebotpp'],
    category: 'owner',
    description: 'Set bot WhatsApp profile picture (Owner Only)',
    usage: 'setpp (reply to image)',
    cooldown: 30,
    permissions: ['owner'],
    ownerOnly: true,

    async execute({ sock, message, from }) {
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const quoted = ctx?.quotedMessage;
        const imageMsg = quoted?.imageMessage;
        if (!imageMsg) {
            return await sock.sendMessage(from, {
                text: '❌ Reply to an image with .setpp to update the bot profile picture.'
            }, { quoted: message });
        }
        try {
            const { downloadMediaMessage } = await import('@whiskeysockets/baileys');
            const buffer = await downloadMediaMessage(
                { message: { imageMessage: imageMsg }, key: { remoteJid: from, id: ctx.stanzaId, participant: ctx.participant } },
                'buffer',
                {}
            );
            await sock.updateProfilePicture(sock.user.id, buffer);
            await sock.sendMessage(from, { text: '✅ Bot profile picture updated successfully.' }, { quoted: message });
        } catch (error) {
            await sock.sendMessage(from, { text: `❌ Failed to update profile picture: ${error.message}` }, { quoted: message });
        }
    }
};
