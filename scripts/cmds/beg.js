import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft } from '../../src/utils/economyDB.js';

const CD = 30 * 60 * 1000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const GIVE = ['gave you some change', 'felt generous and handed you cash', 'tossed you some coins', 'donated generously'];
const IGNORE = 'ignored you';

export default {
    config: {
        name: 'beg',
        aliases: [],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Beg for coins (small amount, 30min cooldown)',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}beg' },
    },

    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastBeg, CD);
        if (left > 0) return reply(`⏳ You already begged recently.\nCooldown: ${fmtTime(left)}`);

        const success = Math.random() < 0.7;
        if (success) {
            const amount = rand(10, 150);
            const newWallet = (eco.wallet || 0) + amount;
            saveEco(sender, { lastBeg: Date.now(), wallet: newWallet });
            reply(`🙏 A stranger ${GIVE[rand(0, GIVE.length - 1)]}.\n\nEarned : ${fmtCoins(amount)}\nWallet : ${fmtCoins(newWallet)}`);
        } else {
            saveEco(sender, { lastBeg: Date.now() });
            reply(`🙏 A stranger ${IGNORE}.\n\nBetter luck next time.`);
        }
    },
};
