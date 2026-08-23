import { getEco, saveEco, fmtCoins, displayPhone } from '../../src/utils/economyDB.js';

export default {
    config: {
        name: 'transfer',
        aliases: ['send', 'pay', 'give'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Transfer money to another user',
        category: 'economy',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}transfer @user <amount>' },
    },

    async onStart({ message, args, sender, reply }) {
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const target = ctx?.participant || ctx?.mentionedJid?.[0];

        if (!target) return reply('Mention or reply to someone to transfer to.\nUsage: transfer @user <amount>');
        if (displayPhone(target) === displayPhone(sender)) return reply('❌ You cannot transfer to yourself.');

        const amount = parseInt(args.find(a => /^\d+$/.test(a)) || '', 10);
        if (!amount || amount <= 0 || isNaN(amount)) return reply('Usage: transfer @user <amount>');

        const eco = getEco(sender);
        const wallet = eco.wallet || 0;
        if (wallet < amount) return reply(`❌ You only have ${fmtCoins(wallet)} in your wallet.`);

        const teco = getEco(target);
        const newSenderWallet = wallet - amount;
        const newTargetWallet = (teco.wallet || 0) + amount;

        saveEco(sender, { wallet: newSenderWallet });
        saveEco(target, { wallet: newTargetWallet });

        reply(`✅ Transferred ${fmtCoins(amount)} to +${displayPhone(target)}\n\nYour wallet: ${fmtCoins(newSenderWallet)}`);
    },
};
