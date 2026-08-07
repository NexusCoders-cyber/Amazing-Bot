import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, addXp } from '../../src/utils/economyDB.js';
const CD = 2 * 60 * 60 * 1000;
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const JOBS = [
    ['Programmer', 200, 500], ['Teacher', 150, 400], ['Doctor', 300, 700],
    ['Driver', 100, 300], ['Farmer', 80, 250], ['Engineer', 250, 600],
    ['Chef', 120, 350], ['Designer', 180, 450], ['Writer', 90, 280],
    ['Trader', 200, 600], ['Security Guard', 100, 250], ['Mechanic', 150, 380],
];
export default {
    config: { name: 'work', aliases: ['job', 'earn'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Work to earn coins (2hr cooldown)', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}work' } },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const left = cooldownLeft(eco.lastWork, CD);
        if (left > 0) return reply(`You are resting.\nBack to work in: ${fmtTime(left)}`);
        const [job, min, max] = JOBS[rand(0, JOBS.length - 1)];
        const earned = rand(min, max);
        const { xp, level } = addXp(eco, 30);
        const newWallet = (eco.wallet || 0) + earned;
        saveEco(sender, { wallet: newWallet, lastWork: Date.now(), xp, level });
        reply(`You worked as a ${job}.\n\nEarned : ${fmtCoins(earned)}\nWallet : ${fmtCoins(newWallet)}`);
    },
};
