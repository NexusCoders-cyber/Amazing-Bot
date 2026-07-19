import { getEco, saveEco, fmtCoins } from '../../utils/economyDB.js';

const TAX_RATE = 0.05;

export default {
    name: 'give',
    aliases: ['pay', 'transfer', 'send'],
    category: 'economy',
    description: 'Send coins to another user. A 5% tax is applied.',
    usage: 'give @user <amount>',
    example: 'give @someone 500',
    cooldown: 5,
    permissions: ['user'],
    groupOnly: true,

    async execute({ sock, message, args, from, sender, prefix }) {
        const targetId = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

        if (!targetId) {
            return sock.sendMessage(from, {
                text: `❌ Mention who to send coins to.\nUsage: ${prefix}give @user <amount>`
            }, { quoted: message });
        }

        if (targetId === sender) {
            return sock.sendMessage(from, { text: `❌ You cannot send coins to yourself.` }, { quoted: message });
        }

        const amountStr = args.find(a => /^\d+$/.test(a));
        const amount = parseInt(amountStr, 10);

        if (!amount || amount < 1) {
            return sock.sendMessage(from, {
                text: `❌ Enter a valid amount.\nUsage: ${prefix}give @user <amount>`
            }, { quoted: message });
        }

        if (amount < 10) {
            return sock.sendMessage(from, { text: `❌ Minimum transfer amount is 10 coins.` }, { quoted: message });
        }

        const senderEco = getEco(sender);

        if ((senderEco.wallet || 0) < amount) {
            return sock.sendMessage(from, {
                text: `❌ Not enough coins in your wallet.\n💰 Your wallet: ${fmtCoins(senderEco.wallet)} coins`
            }, { quoted: message });
        }

        const tax = Math.ceil(amount * TAX_RATE);
        const received = amount - tax;
        const targetPhone = targetId.replace(/[^0-9]/g, '');
        const targetEco = getEco(targetId);

        saveEco(sender, {
            wallet: (senderEco.wallet || 0) - amount,
            totalSpent: (senderEco.totalSpent || 0) + amount
        });

        saveEco(targetId, {
            wallet: (targetEco.wallet || 0) + received,
            totalEarned: (targetEco.totalEarned || 0) + received
        });

        await sock.sendMessage(from, {
            text: `✅ *Transfer Complete*\n\n💸 Sent:      ${fmtCoins(amount)} coins\n🏛️ Tax (5%): -${fmtCoins(tax)} coins\n📩 Received:  ${fmtCoins(received)} coins → @${targetPhone}\n\n👛 Your wallet: ${fmtCoins((senderEco.wallet || 0) - amount)} coins`,
            mentions: [targetId]
        }, { quoted: message });
    }
};
