import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, addXp } from '../../src/utils/economyDB.js';

const CD = 365 * 24 * 60 * 60 * 1000; // 365 days
const BASE = 50000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export default {
    config: {
        name: 'yearly',
        aliases: ['yearlyreward'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Claim yearly reward',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}yearly' },
    },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastYearly, CD);
        if (left > 0) return reply(`Already claimed this year.\nNext claim in: ${fmtTime(left)}`);

        const amount = rand(BASE, BASE * 3);
        const { xp, level } = addXp(eco, 1000);
        const newWallet = (eco.wallet || 0) + amount;
        saveEco(sender, { wallet: newWallet, lastYearly: Date.now(), xp, level });

        reply([
            '🎉 *YEARLY BONUS!*',
            '',
            `Reward : ${fmtCoins(amount)}`,
            `Wallet : ${fmtCoins(newWallet)}`,
            `Level  : ${level}`,
            '',
            'See you next year! 🥂',
        ].join('\n'));
    },
};
