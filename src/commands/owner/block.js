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

export async function isUserBlocked(jid) {
    const data = await loadBlocked();
    const num = jid.split('@')[0].split(':')[0];
    return !!data[num];
}

export default {
    name: 'block',
    aliases: ['blacklist'],
    category: 'owner',
    description: 'Block a user from using the bot',
    usage: 'block @user [reason] OR reply to message',
    cooldown: 5,
    permissions: ['owner'],
    ownerOnly: true,
    args: false,
    minArgs: 0,

    async execute({ sock, message, args, from, sender }) {
        try {
            let targetUser = null;
            const reason = args.filter(a => !a.startsWith('@')).join(' ') || 'Blocked by owner';

            const ctx = message.message?.extendedTextMessage?.contextInfo;
            if (ctx?.quotedMessage && ctx?.participant) {
                targetUser = ctx.participant;
            } else if (ctx?.mentionedJid?.[0]) {
                targetUser = ctx.mentionedJid[0];
            } else if (args[0]?.startsWith('@') || args[0]?.match(/^[0-9]+$/)) {
                const rawNum = args[0].replace('@', '').replace(/[^0-9]/g, '');
                targetUser = rawNum + '@s.whatsapp.net';
            }

            if (!targetUser) {
                return sock.sendMessage(from, {
                    text: '❌ *No user specified.*\n\nMention a user or reply to their message.\n\nUsage: `block @user [reason]`'
                }, { quoted: message });
            }

            const targetNum = targetUser.split('@')[0].split(':')[0];
            const senderNum = sender.split('@')[0].split(':')[0];

            if (targetNum === senderNum) {
                return sock.sendMessage(from, {
                    text: '❌ You cannot block yourself.'
                }, { quoted: message });
            }

            const blocked = await loadBlocked();

            if (blocked[targetNum]) {
                return sock.sendMessage(from, {
                    text: `ℹ️ *Already Blocked*\n\n@${targetNum} is already blocked.\nReason: ${blocked[targetNum].reason}\nDate: ${blocked[targetNum].blockedAt}`,
                    mentions: [targetUser]
                }, { quoted: message });
            }

            blocked[targetNum] = {
                jid: targetUser,
                reason,
                blockedBy: senderNum,
                blockedAt: new Date().toLocaleDateString()
            };

            await saveBlocked(blocked);

            await sock.sendMessage(from, {
                text: `🚫 *User Blocked*\n\n👤 User: @${targetNum}\n📝 Reason: ${reason}\n📅 Date: ${new Date().toLocaleDateString()}\n\nThis user can no longer use any bot commands.`,
                mentions: [targetUser]
            }, { quoted: message });

            try {
                await sock.sendMessage(targetUser.replace('@lid', '@s.whatsapp.net'), {
                    text: `🚫 *You have been blocked from using this bot.*\n\nReason: ${reason}\n\nContact the bot owner if you believe this is a mistake.`
                });
            } catch {}

        } catch (error) {
            await sock.sendMessage(from, {
                text: `❌ Block failed: ${error.message}`
            }, { quoted: message });
        }
    }
};
