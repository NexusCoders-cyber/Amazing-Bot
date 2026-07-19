import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, hasEffect, addXp } from '../../utils/economyDB.js';

const COOLDOWN = 24 * 60 * 60 * 1000;
const BASE_MIN = 300;
const BASE_MAX = 800;
const STREAK_BONUS_PER_DAY = 50;
const MAX_STREAK_BONUS = 1000;

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    name: 'daily',
    aliases: ['claim', 'checkin'],
    category: 'economy',
    description: 'Claim your daily coins. Streak bonuses apply for consecutive days.',
    usage: 'daily',
    example: 'daily',
    cooldown: 3,
    permissions: ['user'],

    async execute({ sock, message, from, sender }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastDaily, COOLDOWN);

        if (left > 0) {
            return sock.sendMessage(from, {
                text: `⏰ Already claimed today.\n⌛ Next daily in: *${fmtTime(left)}*\n🔥 Current streak: *${eco.streak || 0} days*`
            }, { quoted: message });
        }

        const now = Date.now();
        const lastDaily = eco.lastDaily || 0;
        const gapHours = (now - lastDaily) / 3600000;
        const streakBroken = gapHours > 48;
        const newStreak = streakBroken ? 1 : (eco.streak || 0) + 1;

        let base = rand(BASE_MIN, BASE_MAX);
        const streakBonus = Math.min(newStreak * STREAK_BONUS_PER_DAY, MAX_STREAK_BONUS);

        const hasCharm = hasEffect(eco, 'lucky_charm_daily');
        let charmBonus = 0;
        let activeEffects = eco.activeEffects || [];

        if (hasCharm) {
            charmBonus = Math.floor(base * 0.5);
            activeEffects = activeEffects.filter(e => e.id !== 'lucky_charm_daily');
        }

        const total = base + streakBonus + charmBonus;
        const { xp, level } = addXp(eco, 20 + newStreak);
        const leveledUp = level > (eco.level || 1);

        saveEco(sender, {
            wallet: (eco.wallet || 0) + total,
            totalEarned: (eco.totalEarned || 0) + total,
            lastDaily: now,
            streak: newStreak,
            xp,
            level,
            activeEffects
        });

        let text = `✅ *Daily Reward Claimed!*\n\n`;
        text += `🎁 Base reward:    +${fmtCoins(base)} coins\n`;
        if (streakBonus > 0) text += `🔥 Streak bonus:   +${fmtCoins(streakBonus)} coins\n`;
        if (charmBonus > 0) text += `🍀 Lucky charm:    +${fmtCoins(charmBonus)} coins\n`;
        text += `─────────────────────\n`;
        text += `💰 Total:          +${fmtCoins(total)} coins\n\n`;
        text += `🔥 Streak: *${newStreak} day${newStreak !== 1 ? 's' : ''}*`;
        if (streakBroken && lastDaily > 0) text += ` (streak was reset)`;
        text += `\n👛 New wallet: ${fmtCoins((eco.wallet || 0) + total)} coins`;
        if (leveledUp) text += `\n\n🎉 Level up! You are now *Level ${level}*!`;
        text += `\n⏰ Next claim: 24 hours`;

        await sock.sendMessage(from, { text }, { quoted: message });
    }
};
