import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';
export default {
    config: { name: 'withdraw', aliases: ['with', 'wd'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Withdraw money from your bank', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}withdraw <amount | all>' } },
    async onStart({ args, sender, reply }) {
        const eco = getEco(sender);
        const bank = eco.bank || 0;
        if (bank <= 0) return reply('Your bank is empty.');
        const input = (args[0] || '').toLowerCase();
        const amount = input === 'all' ? bank : parseInt(input);
        if (!amount || amount <= 0 || isNaN(amount)) return reply('Usage: withdraw <amount | all>');
        if (amount > bank) return reply(`You only have ${fmtCoins(bank)} in your bank.`);
        saveEco(sender, { wallet: (eco.wallet || 0) + amount, bank: bank - amount });
        reply(`Withdrew ${fmtCoins(amount)} from bank.\n\nWallet : ${fmtCoins((eco.wallet || 0) + amount)}\nBank   : ${fmtCoins(bank - amount)}`);
    },
};
