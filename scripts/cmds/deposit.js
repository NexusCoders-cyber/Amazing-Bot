import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';

export default {
    config: {
        name: 'deposit',
        aliases: ['dep', 'save'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Deposit money into your bank',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}deposit <amount | all>' },
    },

    async onStart({ args, sender, reply }) {
        const eco = getEco(sender);
        const wallet = eco.wallet || 0;
        const cap = eco.bankCapacity || 50000;
        const space = Math.max(0, cap - (eco.bank || 0));

        if (wallet <= 0) return reply('❌ Your wallet is empty.');
        if (space <= 0) return reply(`❌ Bank is full. Capacity: ${fmtCoins(cap)}`);

        const input = (args[0] || '').toLowerCase();
        const amount = input === 'all' ? Math.min(wallet, space) : parseInt(input, 10);

        if (!amount || amount <= 0 || isNaN(amount)) return reply('Usage: deposit <amount | all>');
        if (amount > wallet) return reply(`❌ You only have ${fmtCoins(wallet)} in your wallet.`);

        const dep = Math.min(amount, space);
        const newWallet = wallet - dep;
        const newBank = (eco.bank || 0) + dep;
        saveEco(sender, { wallet: newWallet, bank: newBank });

        reply(`✅ Deposited ${fmtCoins(dep)}\n\nWallet : ${fmtCoins(newWallet)}\nBank   : ${fmtCoins(newBank)}`);
    },
};
