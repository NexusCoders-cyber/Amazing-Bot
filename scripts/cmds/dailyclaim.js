import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, addXp } from '../../src/utils/economyDB.js';

const CD = 24 * 60 * 60 * 1000; // 24 hours
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

const BONUSES = [
    { tier: ' bronze', min: 50, max: 150, streak: 0 },
    { tier: ' silver', min: 150, max: 400, streak: 3 },
    { tier: ' gold', min: 400, max: 800, streak: 7 },
    { tier: ' diamond', min: 800, max: 1500, streak: 14 },
];

export default {
    config: {
        name: 'dailyclaim',
        aliases: ['dailybonus', 'dbonus'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Claim daily bonus based on streak',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}dailyclaim' },
    },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastDailyClaim, CD);
        if (left > 0) return reply(`Already claimed today.\nNext claim in: ${fmtTime(left)}`);

        const streak = eco.claimStreak || 0;
        const gap = (Date.now() - (eco.lastDailyClaim || 0)) / 3600000;
        const newStreak = gap > 48 ? 1 : streak + 1;

        // Find best bonus tier
        let bonus = BONUSES[0];
        for (const b of BONUSES) {
            if (newStreak >= b.streak) bonus = b;
        }

        const amount = rand(bonus.min, bonus.max);
        const { xp, level } = addXp(eco, 60);
        const newWallet = (eco.wallet || 0) + amount;

        saveEco(sender, {
            wallet: newWallet,
            lastDailyClaim: Date.now(),
            claimStreak: newStreak,
            xp,
            level,
        });

        const tiers = BONUSES.slice().reverse();
        const nextTier = tiers.find(t => newStreak < t.streak);

        reply([
            `📋 *Daily Claim — ${bonus.tier} tier*`,
            '',
            `Earned : ${fmtCoins(amount)}`,
            `Streak : ${newStreak} days`,
            `Wallet : ${fmtCoins(newWallet)}`,
            '',
            nextTier ? `Next tier (${nextTier.tier}) at ${nextTier.streak} day streak` : '🏆 Max tier reached!',
        ].join('\n'));
    },
};
