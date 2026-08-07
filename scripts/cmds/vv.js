import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
    config: {
        name: 'vv',
        aliases: ['viewonce', 'openvv'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Open view-once media and send as normal',
        category: 'general',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}vv — reply to a view-once message' },
    },

    async onStart({ message, reply, sock, from, sender, quoted, React }) {
        React('👁️');

        const quotedMsg = quoted || message?.message?.extendedTextMessage?.contextInfo?.message;
        if (!quotedMsg) {
            return reply(`❌ Reply to a *view-once* message to open it.`);
        }

        const isViewOnce = quotedMsg?.message?.viewOnceMessageV2 ||
                          quotedMsg?.message?.viewOnceMessage ||
                          quotedMsg?.message?.ephemeralMessage?.message?.viewOnceMessageV2;

        if (!isViewOnce) {
            return reply(`❌ That's not a view-once message.`);
        }

        try {
            const innerMsg = isViewOnce.message || isViewOnce;
            const type = Object.keys(innerMsg).find(k => ['imageMessage', 'videoMessage', 'audioMessage'].includes(k));

            if (!type) return reply(`❌ Could not identify media type.`);

            const buffer = await downloadMediaMessage(
                { key: quotedMsg.key, message: innerMsg },
                'buffer',
                {}
            );

            const caption = innerMsg[type]?.caption || '';

            if (type === 'imageMessage') {
                await sock.sendMessage(from, {
                    image: buffer,
                    caption: caption || `👁️ View-once image opened`,
                }, { quoted: message });
            } else if (type === 'videoMessage') {
                await sock.sendMessage(from, {
                    video: buffer,
                    caption: caption || `👁️ View-once video opened`,
                }, { quoted: message });
            } else if (type === 'audioMessage') {
                await sock.sendMessage(from, {
                    audio: buffer,
                    mimetype: 'audio/mpeg',
                }, { quoted: message });
            }

            reply(`✅ View-once opened!`);
        } catch (err) {
            reply(`❌ Failed: ${err.message}`);
        }
    },
};
