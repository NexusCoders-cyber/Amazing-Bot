import { downloadContentFromMessage } from '@whiskeysockets/baileys';
import { registerOnReply } from '../../src/utils/amazingbot.js';
import { getSessionControl } from '../../src/utils/sessionControl.js';
import { displayPhone } from '../../src/utils/economyDB.js';

const MEDIA_TYPES = ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'];

function findMedia(msgContent) {
    if (!msgContent) return null;
    const type = MEDIA_TYPES.find(t => msgContent[t]);
    if (!type) return null;
    return { type, content: msgContent[type] };
}

function findAnyMedia(message) {
    const quotedMsg = message?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    return findMedia(quotedMsg) || findMedia(message?.message);
}

async function downloadMedia(type, content) {
    const stream = await downloadContentFromMessage(content, type.replace('Message', ''));
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks);
}

async function forwardAttachment(sock, jid, message, caption, mentions, quoted) {
    const found = findAnyMedia(message);
    if (!found) return null;

    const buffer = await downloadMedia(found.type, found.content);
    const opts = { mentions };
    if (quoted) opts.quoted = quoted;

    if (found.type === 'imageMessage') return sock.sendMessage(jid, { image: buffer, caption, ...opts });
    if (found.type === 'videoMessage') return sock.sendMessage(jid, { video: buffer, caption, ...opts });
    if (found.type === 'audioMessage') return sock.sendMessage(jid, { audio: buffer, mimetype: 'audio/mpeg', ...opts });
    if (found.type === 'stickerMessage') return sock.sendMessage(jid, { sticker: buffer, ...opts });
    return sock.sendMessage(jid, { document: buffer, fileName: 'attachment', caption, ...opts });
}

async function sendToTarget(sock, jid, message, text, mentions, quoted) {
    const sent = await forwardAttachment(sock, jid, message, text, mentions, quoted);
    if (sent) return sent;
    const opts = { mentions };
    if (quoted) opts.quoted = quoted;
    return sock.sendMessage(jid, { text }, opts);
}

async function resolveName(usersData, jid, fallback) {
    const phone = displayPhone(jid);
    const user = await usersData.get(phone);
    return user?.name || fallback || `+${phone}`;
}

async function resolveThreadName(sock, threadsData, jid) {
    try {
        const t = await threadsData.get(jid);
        if (t?.threadName) return t.threadName;
    } catch {}
    try {
        const meta = await sock.groupMetadata(jid);
        return meta.subject || 'Unknown Group';
    } catch {
        return 'Unknown Group';
    }
}

export default {
    config: {
        name: 'callad',
        aliases: ['contactadmin', 'reportbug'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Send a report, feedback, or bug to the bot admins',
        longDescription: 'Sends a message (with any attached image, video, audio, or document) directly to the bot owner and sudo users. They can reply and it forwards back to you, continuing the conversation.',
        category: 'general',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}callad <message>' },
    },

    async onStart({ sock, message, args, from, sender, isGroup, pushName, reply, usersData, threadsData }) {
        const text = args.join(' ').trim();
        if (!text && !findAnyMedia(message)) return reply('Please enter the message you want to send to the admins.');

        const session = await getSessionControl(sock);
        const admins = [...new Set([...(session.owners || []), ...(session.sudoers || [])])];

        if (!admins.length) return reply('The bot has no admin configured at the moment.');

        const senderPhone = displayPhone(sender);
        const senderName = await resolveName(usersData, sender, pushName);
        const threadName = isGroup ? await resolveThreadName(sock, threadsData, from) : null;

        let header = `📨 *Call Admin*\n\nFrom : ${senderName} (+${senderPhone})`;
        header += isGroup ? `\nGroup: ${threadName} (${from.split('@')[0]})` : `\nChat : Private message`;
        const body = `${header}\n\nMessage:\n─────────────\n${text || '(attachment only)'}\n─────────────\nReply to this message to respond to the user.`;

        const successNames = [];
        const failedNames = [];

        for (const adminNum of admins) {
            const adminJid = `${adminNum}@s.whatsapp.net`;
            try {
                const sent = await sendToTarget(sock, adminJid, message, body, [sender]);
                const sentId = sent?.key?.id;
                if (sentId) {
                    registerOnReply(sentId, {
                        commandName: 'callad',
                        type: 'adminReply',
                        threadID: from,
                        senderID: sender,
                        senderName,
                        senderPhone,
                        originalMessage: { key: message.key, message: message.message },
                    });
                    successNames.push(adminNum);
                } else {
                    failedNames.push(adminNum);
                }
            } catch {
                failedNames.push(adminNum);
            }
        }

        let resultText = '';
        if (successNames.length) resultText += `✅ Sent to ${successNames.length} admin${successNames.length !== 1 ? 's' : ''} successfully.`;
        if (failedNames.length) resultText += `${resultText ? '\n' : ''}❌ Failed to reach ${failedNames.length} admin${failedNames.length !== 1 ? 's' : ''}.`;

        if (resultText) reply(resultText);
    },

    async onReply({ sock, message, args, sender, reply, Reply }) {
        const text = args.join(' ').trim();
        if (!text && !findAnyMedia(message)) return reply('Please enter your reply message.');

        if (Reply.type === 'adminReply') {
            const adminName = message.pushName || 'Admin';
            const body = `📍 *Reply from admin ${adminName}:*\n─────────────\n${text || '(attachment only)'}\n─────────────\nReply to this message to continue the conversation.`;

            try {
                const sent = await sendToTarget(sock, Reply.threadID, message, body, [Reply.senderID], Reply.originalMessage);
                await reply('✅ Sent your reply to the user successfully.');

                const sentId = sent?.key?.id;
                if (sentId) {
                    registerOnReply(sentId, {
                        commandName: 'callad',
                        type: 'userCallAdmin',
                        threadID: Reply.threadID,
                        senderID: Reply.senderID,
                        senderName: Reply.senderName,
                        senderPhone: Reply.senderPhone,
                        originalMessage: { key: message.key, message: message.message },
                    });
                }
            } catch (err) {
                reply(`❌ Failed to send your reply to the user: ${err.message}`);
            }
            return;
        }

        if (Reply.type === 'userCallAdmin') {
            const session = await getSessionControl(sock);
            const admins = [...new Set([...(session.owners || []), ...(session.sudoers || [])])];
            const body = `📝 *Follow-up from ${Reply.senderName} (+${Reply.senderPhone}):*\n─────────────\n${text || '(attachment only)'}\n─────────────\nReply to this message to respond to the user.`;

            let sentAny = false;
            for (const adminNum of admins) {
                const adminJid = `${adminNum}@s.whatsapp.net`;
                try {
                    const sent = await sendToTarget(sock, adminJid, message, body, [Reply.senderID]);
                    const sentId = sent?.key?.id;
                    if (sentId) {
                        sentAny = true;
                        registerOnReply(sentId, {
                            commandName: 'callad',
                            type: 'adminReply',
                            threadID: Reply.threadID,
                            senderID: Reply.senderID,
                            senderName: Reply.senderName,
                            senderPhone: Reply.senderPhone,
                            originalMessage: { key: message.key, message: message.message },
                        });
                    }
                } catch {}
            }

            reply(sentAny ? '✅ Sent your reply to the admin successfully.' : '❌ Could not reach any admin right now.');
        }
    },
};
