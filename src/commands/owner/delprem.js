import { getUser, updateUser } from '../../models/User.js';

export default {
    name: 'delprem',
    aliases: ['removeprem', 'delpremium'],
    category: 'owner',
    description: 'Remove premium membership from a user (Owner Only)',
    usage: 'delprem @user [reason]',
    cooldown: 5,
    permissions: ['owner'],
    ownerOnly: true,
    args: false,
    minArgs: 0,

    async execute({ sock, message, args, from, sender }) {
        try {
            let targetUser = null;
            const reason = args.filter(a => !a.startsWith('@')).join(' ') || 'Premium revoked by owner';

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
                    text: '❌ *No user specified.*\n\nMention a user or reply to their message.\n\nUsage: `delprem @user [reason]`'
                }, { quoted: message });
            }

            const targetNum = targetUser.split('@')[0].split(':')[0];
            const user = await getUser(targetUser);

            if (!user) {
                return sock.sendMessage(from, {
                    text: `❌ User @${targetNum} not found in database. They may not have used the bot yet.`,
                    mentions: [targetUser]
                }, { quoted: message });
            }

            if (!user.isPremium) {
                return sock.sendMessage(from, {
                    text: `ℹ️ *Not Premium*\n\n@${targetNum} does not have a premium membership.`,
                    mentions: [targetUser]
                }, { quoted: message });
            }

            const previousExpiry = user.premiumUntil
                ? new Date(user.premiumUntil).toLocaleDateString()
                : 'N/A';
            const previousType = user.premiumType || 'standard';

            await updateUser(targetUser, {
                isPremium: false,
                premiumUntil: null,
                premiumType: null
            });

            await sock.sendMessage(from, {
                text: `✅ *Premium Removed*\n\n👤 User: @${targetNum}\n💎 Previous tier: ${previousType}\n📅 Was valid until: ${previousExpiry}\n📝 Reason: ${reason}\n\nUser has been downgraded to standard access.`,
                mentions: [targetUser]
            }, { quoted: message });

            try {
                await sock.sendMessage(targetUser.replace('@lid', '@s.whatsapp.net'), {
                    text: `📢 *Premium Membership Removed*\n\nYour premium membership has been revoked.\nReason: ${reason}\n\nContact the bot owner for more information.`
                });
            } catch {}

        } catch (error) {
            await sock.sendMessage(from, {
                text: `❌ Failed to remove premium: ${error.message}`
            }, { quoted: message });
        }
    }
};
