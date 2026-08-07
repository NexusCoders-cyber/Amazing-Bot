import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, addXp } from '../../src/utils/economyDB.js';
const CD = 7 * 24 * 60 * 60 * 1000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export default {
    config: { name: 'weekly', aliases: ['week', 'weeklyreward'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Claim weekly reward', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}weekly' } },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastWeekly, CD);
        if (left > 0) return reply(`Weekly already claimed.\nNext weekly in: ${fmtTime(left)}`);
        const amount = rand(3000, 8000);
        const { xp, level } = addXp(eco, 200);
        const newWallet = (eco.wallet || 0) + amount;
        saveEco(sender, { wallet: newWallet, lastWeekly: Date.now(), xp, level });
        reply(`Weekly reward claimed!\n\nEarned : ${fmtCoins(amount)}\nWallet : ${fmtCoins(newWallet)}`);
    },
};
