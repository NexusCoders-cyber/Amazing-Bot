import fs from 'fs-extra';
import path from 'path';

const BLOCK_FILE = path.join(process.cwd(), 'data', 'bot_blocked.json');

async function loadBlocked() {
    try {
        await fs.ensureDir(path.dirname(BLOCK_FILE));
        if (!await fs.pathExists(BLOCK_FILE)) return {};
        return await fs.readJSON(BLOCK_FILE);
    } catch {
        return {};
    }
}

async function saveBlocked(data) {
    try {
        await fs.ensureDir(path.dirname(BLOCK_FILE));
        await fs.writeJSON(BLOCK_FILE, data, { spaces: 2 });
    } catch {}
}

export default {
    name: 'unblock',
    aliases: ['unban', 'whitelist'],
    category: 'owner',
    description: 'Unblock a user and restore bot access',
    usage: 'unblock @user [reason] OR reply to message',
    cooldown: 5,
    permissions: ['owner'],
    ownerOnly: true,
    args: false,
    minArgs: 0,

    async execute({ sock, message, args, from }) {
        try {
            let targetUser = null;
            const reason = args.filter(a => !a.startsWith('@')).join(' ') || 'Unblocked by owner';

            const ctx = message.message?.extendedTextMessage?.contextInfo;
            if (ctx?.quotedMessage && ctx?.participant) {
                targetUser = ctx.participant;
            } else if (ctx?.mentionedJid?.[0]) {
                targetUser = ctx.mentionedJid[0];
            } else if (args[0]) {
                const rawNum = args[0].replace('@', '').replace(/[^0-9]/g, '');
                if (rawNum.length >= 7) targetUser = rawNum + '@s.whatsapp.net';
            }

            if (!targetUser) {
                return sock.sendMessage(from, {
                    text: '❌ *No user specified.*\n\nMention a user or reply to their message.\n\nUsage: `unblock @user [reason]`'
                }, { quoted: message });
            }

            const targetNum = targetUser.split('@')[0].split(':')[0];
            const blocked = await loadBlocked();

            if (!blocked[targetNum]) {
                return sock.sendMessage(from, {
                    text: `ℹ️ *Not Blocked*\n\n@${targetNum} is not currently blocked.`,
                    mentions: [targetUser]
                }, { quoted: message });
            }

            const blockInfo = blocked[targetNum];
            delete blocked[targetNum];
            await saveBlocked(blocked);

            await sock.sendMessage(from, {
                text: `✅ *User Unblocked*\n\n👤 User: @${targetNum}\n📝 Reason: ${reason}\n📅 Date: ${new Date().toLocaleDateString()}\n\n*Previous block info:*\n• Originally blocked: ${blockInfo.blockedAt || 'Unknown'}\n• Block reason: ${blockInfo.reason || 'Not specified'}\n\nUser can now use all bot commands again.`,
                mentions: [targetUser]
            }, { quoted: message });

            try {
                const jidToNotify = targetNum + '@s.whatsapp.net';
                await sock.sendMessage(jidToNotify, {
                    text: `✅ *You have been unblocked!*\n\nReason: ${reason}\nDate: ${new Date().toLocaleDateString()}\n\nYou can now use all bot commands again.`
                });
            } catch {}

        } catch (error) {
            await sock.sendMessage(from, {
                text: `❌ Unblock failed: ${error.message}`
            }, { quoted: message });
        }
    }
};
