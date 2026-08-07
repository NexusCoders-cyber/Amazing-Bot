import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, addXp } from '../../src/utils/economyDB.js';
const CD = 24 * 60 * 60 * 1000, BMIN = 300, BMAX = 800, SBONUS = 50, MAXSBONUS = 1000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export default {
    config: { name: 'daily', aliases: ['claim', 'checkin'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Claim daily coins. Streak bonuses apply.', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}daily' } },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastDaily, CD);
        if (left > 0) return reply(`Already claimed today.\nNext daily in: ${fmtTime(left)}\nStreak: ${eco.streak || 0} days`);
        const now = Date.now();
        const gap = (now - (eco.lastDaily || 0)) / 3600000;
        const newStreak = gap > 48 ? 1 : (eco.streak || 0) + 1;
        const base = rand(BMIN, BMAX);
        const bonus = Math.min(newStreak * SBONUS, MAXSBONUS);
        const total = base + bonus;
        const { xp, level } = addXp(eco, 50);
        const newWallet = (eco.wallet || 0) + total;
        saveEco(sender, { wallet: newWallet, streak: newStreak, lastDaily: now, xp, level });
        reply([
            `Daily claimed!`,
            ``,
            `Earned : ${fmtCoins(total)}`,
            `Base   : ${fmtCoins(base)}`,
            `Streak : ${newStreak} days (+${fmtCoins(bonus)})`,
            `Wallet : ${fmtCoins(newWallet)}`,
            ``,
            newStreak >= 7 ? `7-day streak bonus unlocked!` : `Streak ${newStreak}/7 for bonus`,
        ].join('\n'));
    },
};
