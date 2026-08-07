import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, addXp } from '../../src/utils/economyDB.js';
const CD = 60 * 60 * 1000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const FISH = [
    ['Sardine', 10, 50], ['Catfish', 30, 100], ['Tilapia', 50, 150],
    ['Mackerel', 80, 200], ['Salmon', 150, 400], ['Tuna', 300, 700],
    ['Swordfish', 500, 1000], ['Golden Fish', 1000, 3000],
];
export default {
    config: { name: 'fish', aliases: ['fishing', 'cast'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Go fishing to earn coins (1hr cooldown)', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}fish' } },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastFish, CD);
        if (left > 0) return reply(`Your rod is still in the water.\nCooldown: ${fmtTime(left)}`);
        const caught = Math.random() < 0.8;
        if (!caught) { saveEco(sender, { lastFish: Date.now() }); return reply('You cast your line but caught nothing this time.'); }
        const [name, min, max] = FISH[rand(0, FISH.length - 1)];
        const worth = rand(min, max);
        const { xp, level } = addXp(eco, 20);
        const newWallet = (eco.wallet || 0) + worth;
        saveEco(sender, { wallet: newWallet, lastFish: Date.now(), xp, level });
        reply(`You caught a ${name}!\n\nEarned : ${fmtCoins(worth)}\nWallet : ${fmtCoins(newWallet)}`);
    },
};
