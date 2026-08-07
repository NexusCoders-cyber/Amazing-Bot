import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft } from '../../src/utils/economyDB.js';
const CD = 30 * 60 * 1000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const RESPONSES = ['gave you some change', 'felt generous and handed you cash', 'tossed you some coins', 'ignored you', 'called the police (but you ran away)', 'donated generously'];
export default {
    config: { name: 'beg', aliases: ['beg'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Beg for coins (small amount, 30min cooldown)', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}beg' } },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastBeg, CD);
        if (left > 0) return reply(`You already begged recently.\nCooldown: ${fmtTime(left)}`);
        const success = Math.random() < 0.7;
        saveEco(sender, { lastBeg: Date.now() });
        if (success) {
            const amount = rand(10, 150);
            saveEco(sender, { wallet: (eco.wallet || 0) + amount });
            reply(`A stranger ${RESPONSES[rand(0, RESPONSES.length - 1)]}.\n\nEarned : ${fmtCoins(amount)}\nWallet : ${fmtCoins((eco.wallet || 0) + amount)}`);
        } else {
            reply(`A stranger ${RESPONSES[3]}.\n\nBetter luck next time.`);
        }
    },
};
