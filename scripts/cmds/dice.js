import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export default {
    config: {
        name: 'dice',
        aliases: ['roll', 'gamble'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Roll a die and bet on high, low, or an exact number',
        category: 'economy',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}dice <amount> <high|low|exact <1-6>>' },
    },

    async onStart({ args, sender, reply }) {
        const amount = parseInt(args[0], 10);
        const mode = (args[1] || '').toLowerCase();

        if (!amount || amount <= 0 || isNaN(amount)) return reply('Usage: dice <amount> <high|low|exact <1-6>>');
        if (!['high', 'low', 'exact'].includes(mode)) return reply('Mode must be: high, low, or exact');

        const eco = getEco(sender);
        const wallet = eco.wallet || 0;
        if (wallet < amount) return reply(`❌ You only have ${fmtCoins(wallet)}.`);

        if (mode === 'exact') {
            const guess = parseInt(args[2], 10);
            if (!guess || guess < 1 || guess > 6) return reply('Exact guess must be 1-6.\nUsage: dice <amount> exact <1-6>');
        }

        const roll = rand(1, 6);
        let win = false, multi = 1;
        if (mode === 'high') win = roll >= 4;
        else if (mode === 'low') win = roll <= 3;
        else { win = roll === parseInt(args[2], 10); multi = 5; }

        const change = win ? amount * multi : -amount;
        const newWallet = wallet + change;
        saveEco(sender, { wallet: newWallet });

        reply(
            `🎲 Rolled: *${roll}*\n\n` +
            `${win ? `✅ You won ${fmtCoins(amount * multi)}!` : `❌ You lost ${fmtCoins(amount)}.`}\n` +
            `Wallet: ${fmtCoins(newWallet)}`
        );
    },
};
