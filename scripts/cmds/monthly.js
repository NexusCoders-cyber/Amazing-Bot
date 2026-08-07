import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, addXp } from '../../src/utils/economyDB.js';

const CD = 30 * 24 * 60 * 60 * 1000; // 30 days
const BASE = 5000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export default {
    config: {
        name: 'monthly',
        aliases: ['monthreward'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Claim monthly reward',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}monthly' },
    },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastMonthly, CD);
        if (left > 0) return reply(`Already claimed this month.\nNext claim in: ${fmtTime(left)}`);

        const amount = rand(BASE, BASE * 3);
        const { xp, level } = addXp(eco, 200);
        const newWallet = (eco.wallet || 0) + amount;
        saveEco(sender, { wallet: newWallet, lastMonthly: Date.now(), xp, level });

        reply([
            '📅 *Monthly Claimed!*',
            '',
            `Reward : ${fmtCoins(amount)}`,
            `Wallet : ${fmtCoins(newWallet)}`,
            `Level  : ${level}`,
        ].join('\n'));
    },
};
