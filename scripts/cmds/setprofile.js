import { isDev } from '../../src/utils/devAccess.js';

export default {
    config: {
        name: 'setprofile',
        aliases: ['setpp'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Set bot profile picture (dev only)',
        category: 'owner',
        coolDown: 30,
        role: 0,
        guide: { en: '{prefix}setprofile — reply to an image' },
    },

    async onStart({ message, reply, sock, sender, React }) {
        React('🖼️');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);

        const quotedMsg = message?.message?.extendedTextMessage?.contextInfo?.message;
        const imageMsg = quotedMsg?.message?.imageMessage || message?.message?.imageMessage;

        if (!imageMsg) return reply(`Reply to an image or send an image with this command.`);

        try {
            const { downloadMediaMessage } = await import('@whiskeysockets/baileys');
            const buffer = await downloadMediaMessage(quotedMsg || message, 'buffer', {});

            await sock.updateProfilePicture(sock.user.id, buffer);
            reply(`✅ Bot profile picture updated!`);
        } catch (err) {
            reply(`❌ Failed: ${err.message}`);
        }
    },
};
