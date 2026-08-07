import { downloadMediaMessage } from '@whiskeysockets/baileys';

export default {
    config: {
        name: 'vv2',
        aliases: ['viewoncedm'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Forward view-once media to your DM',
        category: 'general',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}vv2 — reply to a view-once message' },
    },

    async onStart({ message, reply, sock, from, sender, quoted, React }) {
        React('👁️');

        const quotedMsg = quoted || message?.message?.extendedTextMessage?.contextInfo?.message;
        if (!quotedMsg) {
            return reply(`❌ Reply to a *view-once* message.`);
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

            // Send to sender's DM (private chat)
            const dmJid = sender.split('@')[0] + '@s.whatsapp.net';
            const caption = innerMsg[type]?.caption || '';

            if (type === 'imageMessage') {
                await sock.sendMessage(dmJid, {
                    image: buffer,
                    caption: `👁️ *View-once from:* ${from.includes('@g.us') ? 'Group' : 'Chat'}\n${caption}`,
                });
            } else if (type === 'videoMessage') {
                await sock.sendMessage(dmJid, {
                    video: buffer,
                    caption: `👁️ *View-once from:* ${from.includes('@g.us') ? 'Group' : 'Chat'}\n${caption}`,
                });
            } else if (type === 'audioMessage') {
                await sock.sendMessage(dmJid, {
                    audio: buffer,
                    mimetype: 'audio/mpeg',
                });
            }

            reply(`✅ Sent to your DM!`);
        } catch (err) {
            reply(`❌ Failed: ${err.message}`);
        }
    },
};
