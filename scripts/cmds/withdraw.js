import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';

export default {
    config: {
        name: 'withdraw',
        aliases: ['with', 'wd'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Withdraw money from your bank',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}withdraw <amount | all>' },
    },

    async onStart({ args, sender, reply }) {
        const eco = getEco(sender);
        const bank = eco.bank || 0;

        if (bank <= 0) return reply('❌ Your bank is empty.');

        const input = (args[0] || '').toLowerCase();
        const amount = input === 'all' ? bank : parseInt(input, 10);

        if (!amount || amount <= 0 || isNaN(amount)) return reply('Usage: withdraw <amount | all>');
        if (amount > bank) return reply(`❌ You only have ${fmtCoins(bank)} in your bank.`);

        const newWallet = (eco.wallet || 0) + amount;
        const newBank = bank - amount;
        saveEco(sender, { wallet: newWallet, bank: newBank });

        reply(`✅ Withdrew ${fmtCoins(amount)}\n\nWallet : ${fmtCoins(newWallet)}\nBank   : ${fmtCoins(newBank)}`);
    },
};
