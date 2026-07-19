import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, addXp } from '../../utils/economyDB.js';

const COOLDOWN = 7 * 24 * 60 * 60 * 1000;
const MIN = 2000;
const MAX = 5000;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    name: 'weekly',
    aliases: ['week', 'weeklyreward'],
    category: 'economy',
    description: 'Claim your weekly bonus reward.',
    usage: 'weekly',
    example: 'weekly',
    cooldown: 3,
    permissions: ['user'],

    async execute({ sock, message, from, sender }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastWeekly, COOLDOWN);

        if (left > 0) {
            return sock.sendMessage(from, {
                text: `⏰ Already claimed this week.\n⌛ Next weekly in: *${fmtTime(left)}*`
            }, { quoted: message });
        }

        const amount = rand(MIN, MAX);
        const streakBonus = Math.floor(amount * Math.min((eco.streak || 0) * 0.02, 0.5));
        const total = amount + streakBonus;
        const { xp, level } = addXp(eco, 80);
        const leveledUp = level > (eco.level || 1);

        saveEco(sender, {
            wallet: (eco.wallet || 0) + total,
            totalEarned: (eco.totalEarned || 0) + total,
            lastWeekly: Date.now(),
            xp,
            level
        });

        let text = `🎊 *Weekly Reward Claimed!*\n\n`;
        text += `🎁 Reward:      +${fmtCoins(amount)} coins\n`;
        if (streakBonus > 0) text += `🔥 Streak bonus: +${fmtCoins(streakBonus)} coins\n`;
        text += `─────────────────────\n`;
        text += `💰 Total:       +${fmtCoins(total)} coins\n\n`;
        text += `👛 New wallet: ${fmtCoins((eco.wallet || 0) + total)} coins`;
        if (leveledUp) text += `\n🎉 Level up! You are now *Level ${level}*!`;
        text += `\n⏰ Next weekly: 7 days`;

        await sock.sendMessage(from, { text }, { quoted: message });
    }
};
