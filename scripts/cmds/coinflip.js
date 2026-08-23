import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';

export default {
    config: {
        name: 'coinflip',
        aliases: ['cf', 'flip'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Flip a coin and bet on it',
        category: 'economy',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}coinflip <heads|tails> <amount>' },
    },

    async onStart({ args, sender, reply }) {
        const choice = (args[0] || '').toLowerCase();
        const amount = parseInt(args[1], 10);

        if (!['heads', 'tails'].includes(choice)) return reply('Usage: coinflip <heads|tails> <amount>');
        if (!amount || amount <= 0 || isNaN(amount)) return reply('Enter a valid bet amount.');

        const eco = getEco(sender);
        const wallet = eco.wallet || 0;
        if (wallet < amount) return reply(`❌ You only have ${fmtCoins(wallet)}.`);

        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const win = result === choice;
        const newWallet = wallet + (win ? amount : -amount);
        saveEco(sender, { wallet: newWallet });

        reply(
            `🪙 Coin landed on *${result.toUpperCase()}*\nYou called: ${choice.toUpperCase()}\n\n` +
            `${win ? `✅ You won ${fmtCoins(amount)}!` : `❌ You lost ${fmtCoins(amount)}.`}\n` +
            `Wallet: ${fmtCoins(newWallet)}`
        );
    },
};
