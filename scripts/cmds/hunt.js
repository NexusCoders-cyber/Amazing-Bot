import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, addXp } from '../../src/utils/economyDB.js';
const CD = 90 * 60 * 1000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const ANIMALS = [
    ['Rabbit', 50, 150], ['Deer', 200, 500], ['Wild Boar', 400, 800],
    ['Wolf', 600, 1200], ['Bear', 800, 1800], ['Lion', 1500, 3000],
];
export default {
    config: { name: 'hunt', aliases: ['hunting', 'shoot'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Go hunting to earn coins (1.5hr cooldown)', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}hunt' } },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastHunt, CD);
        if (left > 0) return reply(`Your gun needs to cool down.\nCooldown: ${fmtTime(left)}`);
        const hit = Math.random() < 0.75;
        if (!hit) { saveEco(sender, { lastHunt: Date.now() }); return reply('You missed your shot. Better aim next time.'); }
        const [animal, min, max] = ANIMALS[rand(0, ANIMALS.length - 1)];
        const worth = rand(min, max);
        const { xp, level } = addXp(eco, 35);
        const newWallet = (eco.wallet || 0) + worth;
        saveEco(sender, { wallet: newWallet, lastHunt: Date.now(), xp, level });
        reply(`You hunted a ${animal}!\n\nEarned : ${fmtCoins(worth)}\nWallet : ${fmtCoins(newWallet)}`);
    },
};
