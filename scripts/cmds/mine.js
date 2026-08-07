import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, addXp } from '../../src/utils/economyDB.js';
const CD = 2 * 60 * 60 * 1000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const ORES = [
    ['Coal', 30, 80], ['Iron', 80, 200], ['Gold', 200, 500],
    ['Emerald', 400, 900], ['Diamond', 800, 2000], ['Ruby', 1500, 4000],
];
export default {
    config: { name: 'mine', aliases: ['mining', 'dig'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Go mining to earn coins (2hr cooldown)', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}mine' } },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastMine, CD);
        if (left > 0) return reply(`Your pickaxe needs a rest.\nCooldown: ${fmtTime(left)}`);
        const found = Math.random() < 0.85;
        if (!found) { saveEco(sender, { lastMine: Date.now() }); return reply('You dug for hours but found nothing valuable.'); }
        const [ore, min, max] = ORES[rand(0, ORES.length - 1)];
        const worth = rand(min, max);
        const { xp, level } = addXp(eco, 25);
        const newWallet = (eco.wallet || 0) + worth;
        saveEco(sender, { wallet: newWallet, lastMine: Date.now(), xp, level });
        reply(`You mined ${ore}!\n\nEarned : ${fmtCoins(worth)}\nWallet : ${fmtCoins(newWallet)}`);
    },
};
