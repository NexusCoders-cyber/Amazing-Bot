import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, hasEffect } from '../../utils/economyDB.js';

const COOLDOWN = 60 * 60 * 1000;
const SUCCESS_CHANCE = 0.40;
const MIN_PCT = 0.10;
const MAX_PCT = 0.30;
const FAIL_FINE_MIN = 100;
const FAIL_FINE_MAX = 400;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    name: 'rob',
    aliases: ['steal', 'mug'],
    category: 'economy',
    description: 'Attempt to rob another user. 40% success. Fail and pay a fine.',
    usage: 'rob @user',
    example: 'rob @someone',
    cooldown: 3,
    permissions: ['user'],
    groupOnly: true,

    async execute({ sock, message, args, from, sender, prefix }) {
        const targetId = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!targetId) {
            return sock.sendMessage(from, {
                text: `❌ Mention someone to rob.\nUsage: ${prefix}rob @user`
            }, { quoted: message });
        }

        if (targetId === sender) {
            return sock.sendMessage(from, {
                text: `❌ You can't rob yourself.`
            }, { quoted: message });
        }

        const robberEco = getEco(sender);
        const left = cooldownLeft(robberEco.lastRob, COOLDOWN);

        if (left > 0) {
            return sock.sendMessage(from, {
                text: `⏰ You need to lay low for a while.\n⌛ Next rob attempt in: *${fmtTime(left)}*`
            }, { quoted: message });
        }

        const targetEco = getEco(targetId);
        const targetPhone = targetId.replace(/[^0-9]/g, '');

        if ((targetEco.wallet || 0) < 100) {
            saveEco(sender, { lastRob: Date.now() });
            return sock.sendMessage(from, {
                text: `💸 @${targetPhone} is too broke to rob. They only have ${fmtCoins(targetEco.wallet)} coins in their wallet.\n⏰ Cooldown still applied.`,
                mentions: [targetId]
            }, { quoted: message });
        }

        if (hasEffect(targetEco, 'shield')) {
            saveEco(sender, { lastRob: Date.now() });
            return sock.sendMessage(from, {
                text: `🛡️ @${targetPhone} is protected by a *Shield*!\nYour robbery was blocked.\n⏰ Cooldown still applied.`,
                mentions: [targetId]
            }, { quoted: message });
        }

        saveEco(sender, { lastRob: Date.now() });

        if (Math.random() > SUCCESS_CHANCE) {
            const fine = rand(FAIL_FINE_MIN, FAIL_FINE_MAX);
            const newWallet = Math.max(0, (robberEco.wallet || 0) - fine);
            saveEco(sender, { wallet: newWallet });

            return sock.sendMessage(from, {
                text: `🚔 *Rob Failed!*\n\n@${targetPhone} caught you in the act!\nYou paid a fine of *${fmtCoins(fine)} coins*.\n\n👛 Your wallet: ${fmtCoins(newWallet)} coins\n⏰ Next attempt: 1 hour`,
                mentions: [targetId]
            }, { quoted: message });
        }

        const pct = MIN_PCT + Math.random() * (MAX_PCT - MIN_PCT);
        const stolen = Math.max(1, Math.floor((targetEco.wallet || 0) * pct));

        saveEco(sender, {
            wallet: (robberEco.wallet || 0) + stolen,
            totalEarned: (robberEco.totalEarned || 0) + stolen
        });
        saveEco(targetId, {
            wallet: Math.max(0, (targetEco.wallet || 0) - stolen)
        });

        await sock.sendMessage(from, {
            text: `🦹 *Rob Successful!*\n\nYou stole *${fmtCoins(stolen)} coins* from @${targetPhone}!\n\n👛 Your wallet: ${fmtCoins((robberEco.wallet || 0) + stolen)} coins\n⏰ Next attempt: 1 hour`,
            mentions: [targetId]
        }, { quoted: message });
    }
};
