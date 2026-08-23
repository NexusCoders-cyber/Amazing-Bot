import { downloadContentFromMessage } from '@whiskeysockets/baileys';

function createApi(sock, defaultJid) {
    const api = {
        sendMessage: async (jid, content, options = {}) => {
            const target = jid || defaultJid;
            if (typeof content === 'string') {
                return await sock.sendMessage(target, { text: content }, options);
            }
            return await sock.sendMessage(target, content, options);
        },

        reply: async (message, content, options = {}) => {
            const jid = message?.key?.remoteJid || defaultJid;
            if (typeof content === 'string') {
                return await sock.sendMessage(jid, { text: content }, { quoted: message, ...options });
            }
            return await sock.sendMessage(jid, content, { quoted: message, ...options });
        },

        editMessage: async (jid, key, newContent) => {
            const target = jid || defaultJid;
            if (typeof newContent === 'string') {
                return await sock.sendMessage(target, { edit: key, text: newContent });
            }
            return await sock.sendMessage(target, { edit: key, ...newContent });
        },

        deleteMessage: async (jid, key) => {
            return await sock.sendMessage(jid || defaultJid, { delete: key });
        },

        sendReaction: async (jid, messageKey, emoji) => {
            return await sock.sendMessage(jid || defaultJid, {
                react: { key: messageKey, text: emoji }
            });
        },

        unsendReaction: async (jid, messageKey) => {
            return await sock.sendMessage(jid || defaultJid, {
                react: { key: messageKey, text: '' }
            });
        },

        sendImage: async (jid, image, caption = '', options = {}) => {
            return await sock.sendMessage(jid || defaultJid, { image, caption, ...options });
        },

        sendVideo: async (jid, video, caption = '', options = {}) => {
            return await sock.sendMessage(jid || defaultJid, { video, caption, ...options });
        },

        sendAudio: async (jid, audio, ptt = false, options = {}) => {
            return await sock.sendMessage(jid || defaultJid, {
                audio,
                mimetype: ptt ? 'audio/ogg; codecs=opus' : 'audio/mpeg',
                ptt,
                ...options
            });
        },

        sendDocument: async (jid, document, fileName, mimetype, caption = '') => {
            return await sock.sendMessage(jid || defaultJid, { document, fileName, mimetype, caption });
        },

        sendSticker: async (jid, sticker) => {
            return await sock.sendMessage(jid || defaultJid, { sticker });
        },

        sendContact: async (jid, contacts) => {
            return await sock.sendMessage(jid || defaultJid, {
                contacts: { displayName: 'Contact', contacts }
            });
        },

        setTyping: async (jid, on = true) => {
            return await sock.sendPresenceUpdate(on ? 'composing' : 'paused', jid || defaultJid);
        },

        setRecording: async (jid, on = true) => {
            return await sock.sendPresenceUpdate(on ? 'recording' : 'paused', jid || defaultJid);
        },

        readMessages: async (keys) => {
            return await sock.readMessages(keys);
        },

        groupMetadata: async (jid) => {
            return await sock.groupMetadata(jid || defaultJid);
        },

        groupParticipantsUpdate: async (jid, participants, action) => {
            return await sock.groupParticipantsUpdate(jid || defaultJid, participants, action);
        },

        groupUpdateSubject: async (jid, subject) => {
            return await sock.groupUpdateSubject(jid || defaultJid, subject);
        },

        groupUpdateDescription: async (jid, description) => {
            return await sock.groupUpdateDescription(jid || defaultJid, description);
        },

        groupInviteCode: async (jid) => {
            return await sock.groupInviteCode(jid || defaultJid);
        },

        getProfilePicture: async (jid) => {
            try {
                return await sock.profilePictureUrl(jid || defaultJid, 'image');
            } catch {
                return null;
            }
        },

        updateProfileStatus: async (status) => {
            return await sock.updateProfileStatus(status);
        },

        onWhatsApp: async (jid) => {
            try {
                const result = await sock.onWhatsApp(jid);
                return result?.[0] || null;
            } catch {
                return null;
            }
        },

        downloadMedia: async (message) => {
            const msg = message?.message;
            if (!msg) return null;
            const type = Object.keys(msg).find(k => ['imageMessage', 'videoMessage', 'audioMessage', 'documentMessage', 'stickerMessage'].includes(k));
            if (!type) return null;
            try {
                const stream = await downloadContentFromMessage(msg[type], type.replace('Message', ''));
                const chunks = [];
                for await (const chunk of stream) chunks.push(chunk);
                return Buffer.concat(chunks);
            } catch {
                return null;
            }
        },

        sock,
    };
    return api;
}

export { createApi };
export default createApi;
