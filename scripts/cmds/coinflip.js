import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';
export default {
    config: { name: 'coinflip', aliases: ['cf', 'flip'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Flip a coin and bet', category: 'economy', coolDown: 5, role: 0,
        guide: { en: '{prefix}coinflip <heads|tails> <amount>' } },
    async onStart({ args, sender, reply }) {
        const choice = (args[0] || '').toLowerCase();
        const amount = parseInt(args[1]);
        if (!['heads', 'tails'].includes(choice)) return reply('Usage: coinflip <heads|tails> <amount>');
        if (!amount || amount <= 0 || isNaN(amount)) return reply('Enter a valid bet amount.');
        const eco = getEco(sender);
        if ((eco.wallet || 0) < amount) return reply(`You only have ${fmtCoins(eco.wallet || 0)}.`);
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const win = result === choice;
        const change = win ? amount : -amount;
        saveEco(sender, { wallet: (eco.wallet || 0) + change });
        reply(`Coin flip: ${result.toUpperCase()}\nYou chose: ${choice.toUpperCase()}\n\n${win ? `You won ${fmtCoins(amount)}!` : `You lost ${fmtCoins(amount)}.`}\nWallet: ${fmtCoins((eco.wallet || 0) + change)}`);
    },
};
