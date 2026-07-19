import { getEco, saveEco, fmtCoins, fmtTime } from '../../utils/economyDB.js';

const INTEREST_RATE = 0.01;
const INTEREST_INTERVAL = 24 * 60 * 60 * 1000;

function calcInterest(eco) {
    const last = eco.lastInterest || eco.createdAt || Date.now();
    const elapsed = Date.now() - last;
    const periods = Math.floor(elapsed / INTEREST_INTERVAL);
    if (periods < 1 || (eco.bank || 0) < 1) return { interest: 0, periods: 0 };
    const interest = Math.floor((eco.bank || 0) * INTEREST_RATE * periods);
    return { interest, periods };
}

export default {
    name: 'bank',
    aliases: ['deposit', 'withdraw', 'savings'],
    category: 'economy',
    description: 'Manage your bank. Deposit, withdraw, or check balance. Earns 1% daily interest.',
    usage: 'bank [deposit|withdraw|interest] [amount|all|half]',
    example: 'bank\nbank deposit 1000\nbank withdraw all\nbank interest',
    cooldown: 3,
    permissions: ['user'],

    async execute({ sock, message, args, from, sender, prefix }) {
        const eco = getEco(sender);
        const sub = args[0]?.toLowerCase();

        if (!sub || sub === 'info' || sub === 'check') {
            const { interest, periods } = calcInterest(eco);
            const pct = eco.bankCapacity > 0 ? Math.round(((eco.bank || 0) / eco.bankCapacity) * 100) : 0;
            const nextInterest = eco.lastInterest
                ? Math.max(0, INTEREST_INTERVAL - (Date.now() - (eco.lastInterest || Date.now())))
                : INTEREST_INTERVAL;

            let text = `🏦 *Bank Account*\n\n`;
            text += `💰 Wallet:   ${fmtCoins(eco.wallet)} coins\n`;
            text += `🏦 Bank:     ${fmtCoins(eco.bank)} / ${fmtCoins(eco.bankCapacity)} coins (${pct}%)\n`;
            text += `📊 Net Worth: ${fmtCoins((eco.wallet || 0) + (eco.bank || 0))} coins\n\n`;
            text += `📈 Interest rate: 1% per day\n`;
            text += `⏰ Next interest: ${fmtTime(nextInterest)}\n`;
            if (interest > 0) text += `\n💡 *${fmtCoins(interest)} coins* in interest ready!\nUse *${prefix}bank interest* to collect.`;

            return sock.sendMessage(from, { text }, { quoted: message });
        }

        if (sub === 'interest') {
            const { interest, periods } = calcInterest(eco);
            if (interest < 1) {
                const nextInterest = eco.lastInterest
                    ? Math.max(0, INTEREST_INTERVAL - (Date.now() - eco.lastInterest))
                    : INTEREST_INTERVAL;
                return sock.sendMessage(from, {
                    text: `⏰ No interest ready yet.\nNext interest in: *${fmtTime(nextInterest)}*`
                }, { quoted: message });
            }
            saveEco(sender, {
                bank: (eco.bank || 0) + interest,
                lastInterest: Date.now()
            });
            return sock.sendMessage(from, {
                text: `📈 *Interest Collected!*\n\n+${fmtCoins(interest)} coins over ${periods} day${periods !== 1 ? 's' : ''}\n🏦 Bank balance: ${fmtCoins((eco.bank || 0) + interest)} coins`
            }, { quoted: message });
        }

        if (sub === 'deposit' || sub === 'dep') {
            const raw = args[1]?.toLowerCase();
            if (!raw) return sock.sendMessage(from, { text: `❌ Specify an amount.\nExample: ${prefix}bank deposit 1000` }, { quoted: message });

            let amount;
            if (raw === 'all') amount = eco.wallet || 0;
            else if (raw === 'half') amount = Math.floor((eco.wallet || 0) / 2);
            else amount = parseInt(raw, 10);

            if (!amount || amount < 1) return sock.sendMessage(from, { text: `❌ Invalid amount.` }, { quoted: message });
            if (amount > (eco.wallet || 0)) return sock.sendMessage(from, { text: `❌ Not enough coins in wallet.\n💰 Wallet: ${fmtCoins(eco.wallet)} coins` }, { quoted: message });

            const space = (eco.bankCapacity || 50000) - (eco.bank || 0);
            if (space <= 0) return sock.sendMessage(from, { text: `❌ Bank is full! Upgrade capacity with ${prefix}shop.` }, { quoted: message });

            const depositing = Math.min(amount, space);
            saveEco(sender, {
                wallet: (eco.wallet || 0) - depositing,
                bank: (eco.bank || 0) + depositing
            });

            return sock.sendMessage(from, {
                text: `✅ *Deposit Successful*\n\n🏦 Deposited: +${fmtCoins(depositing)} coins\n💰 Wallet: ${fmtCoins((eco.wallet || 0) - depositing)} coins\n🏦 Bank: ${fmtCoins((eco.bank || 0) + depositing)} coins`
            }, { quoted: message });
        }

        if (sub === 'withdraw' || sub === 'with') {
            const raw = args[1]?.toLowerCase();
            if (!raw) return sock.sendMessage(from, { text: `❌ Specify an amount.\nExample: ${prefix}bank withdraw 500` }, { quoted: message });

            let amount;
            if (raw === 'all') amount = eco.bank || 0;
            else if (raw === 'half') amount = Math.floor((eco.bank || 0) / 2);
            else amount = parseInt(raw, 10);

            if (!amount || amount < 1) return sock.sendMessage(from, { text: `❌ Invalid amount.` }, { quoted: message });
            if (amount > (eco.bank || 0)) return sock.sendMessage(from, { text: `❌ Not enough in bank.\n🏦 Bank: ${fmtCoins(eco.bank)} coins` }, { quoted: message });

            saveEco(sender, {
                wallet: (eco.wallet || 0) + amount,
                bank: (eco.bank || 0) - amount
            });

            return sock.sendMessage(from, {
                text: `✅ *Withdrawal Successful*\n\n💸 Withdrawn: +${fmtCoins(amount)} coins\n💰 Wallet: ${fmtCoins((eco.wallet || 0) + amount)} coins\n🏦 Bank: ${fmtCoins((eco.bank || 0) - amount)} coins`
            }, { quoted: message });
        }

        return sock.sendMessage(from, {
            text: `❌ Unknown subcommand.\nUse: *deposit*, *withdraw*, *interest*, or just *${prefix}bank* to check balance.`
        }, { quoted: message });
    }
};
