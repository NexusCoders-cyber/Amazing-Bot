import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
export default {
    config: { name: 'dice', aliases: ['roll', 'gamble'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Roll dice and bet. Guess higher/lower/exact.', category: 'economy', coolDown: 5, role: 0,
        guide: { en: '{prefix}dice <amount> <high|low|exact <1-6>>' } },
    async onStart({ args, sender, reply }) {
        const amount = parseInt(args[0]);
        const mode = (args[1] || '').toLowerCase();
        if (!amount || amount <= 0 || isNaN(amount)) return reply('Usage: dice <amount> <high|low|exact <1-6>>');
        if (!['high', 'low', 'exact'].includes(mode)) return reply('Mode must be: high, low, or exact');
        const eco = getEco(sender);
        if ((eco.wallet || 0) < amount) return reply(`You only have ${fmtCoins(eco.wallet || 0)}.`);
        const roll = rand(1, 6);
        let win = false, multi = 1;
        if (mode === 'high') { win = roll >= 4; }
        else if (mode === 'low') { win = roll <= 3; }
        else { const guess = parseInt(args[2]); if (guess < 1 || guess > 6) return reply('Exact guess must be 1-6'); win = roll === guess; multi = 5; }
        const change = win ? amount * multi : -amount;
        saveEco(sender, { wallet: (eco.wallet || 0) + change });
        reply(`Rolled: ${roll}\n\n${win ? `You won ${fmtCoins(amount * multi)}!` : `You lost ${fmtCoins(amount)}.`}\nWallet: ${fmtCoins((eco.wallet || 0) + change)}`);
    },
};
