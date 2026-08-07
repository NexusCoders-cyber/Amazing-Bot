import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft } from '../../src/utils/economyDB.js';
const CD = 3 * 60 * 60 * 1000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const CRIMES = ['robbed a bank', 'pickpocketed a tourist', 'sold counterfeit goods', 'hacked an ATM', 'ran a scam', 'forged documents'];
export default {
    config: { name: 'crime', aliases: ['heist'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Commit a crime for big money (risky)', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}crime' } },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastCrime, CD);
        if (left > 0) return reply(`You need to lay low.\nCooldown: ${fmtTime(left)}`);
        saveEco(sender, { lastCrime: Date.now() });
        const success = Math.random() < 0.6;
        if (success) {
            const earned = rand(500, 2000);
            saveEco(sender, { wallet: (eco.wallet || 0) + earned });
            reply(`You ${CRIMES[rand(0, CRIMES.length - 1)]}!\n\nEarned : ${fmtCoins(earned)}\nWallet : ${fmtCoins((eco.wallet || 0) + earned)}`);
        } else {
            const fine = rand(200, 800);
            saveEco(sender, { wallet: Math.max(0, (eco.wallet || 0) - fine) });
            reply(`You got arrested!\n\nFine   : ${fmtCoins(fine)}\nWallet : ${fmtCoins(Math.max(0, (eco.wallet || 0) - fine))}`);
        }
    },
};
