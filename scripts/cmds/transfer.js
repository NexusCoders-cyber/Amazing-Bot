import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';
export default {
    config: { name: 'transfer', aliases: ['send', 'pay', 'give'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Transfer money to another user', category: 'economy', coolDown: 5, role: 0,
        guide: { en: '{prefix}transfer @user <amount>' } },
    async onStart({ message, args, from, sender, reply }) {
        const target = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target || target === sender) return reply('Mention someone to transfer to.');
        const amount = parseInt(args[1] || args[0]);
        if (!amount || amount <= 0 || isNaN(amount)) return reply('Usage: transfer @user <amount>');
        const eco = getEco(sender);
        if ((eco.wallet || 0) < amount) return reply(`You only have ${fmtCoins(eco.wallet || 0)}.`);
        const teco = getEco(target);
        saveEco(sender, { wallet: (eco.wallet || 0) - amount });
        saveEco(target, { wallet: (teco.wallet || 0) + amount });
        reply(`Transferred ${fmtCoins(amount)} to @${target.split('@')[0]}.\n\nYour wallet: ${fmtCoins((eco.wallet || 0) - amount)}`);
    },
};
