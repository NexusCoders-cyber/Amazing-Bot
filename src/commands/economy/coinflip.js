import { getEco, saveEco, fmtCoins } from '../../utils/economyDB.js';

const MIN_BET = 50;
const MAX_BET_PCT = 0.5;

export default {
    name: 'coinflip',
    aliases: ['cf', 'flip', 'coin'],
    category: 'economy',
    description: 'Bet coins on heads or tails. Win double or lose it all.',
    usage: 'coinflip <heads|tails> <amount|all|half>',
    example: 'coinflip heads 500\ncoinflip tails all',
    cooldown: 5,
    permissions: ['user'],

    async execute({ sock, message, args, from, sender, prefix }) {
        const choice = args[0]?.toLowerCase();
        const amountArg = args[1]?.toLowerCase();

        if (!choice || !['heads', 'tails', 'h', 't'].includes(choice)) {
            return sock.sendMessage(from, {
                text: `❌ Pick *heads* or *tails*.\nUsage: ${prefix}coinflip <heads|tails> <amount>`
            }, { quoted: message });
        }

        if (!amountArg) {
            return sock.sendMessage(from, {
                text: `❌ Enter a bet amount.\nUsage: ${prefix}coinflip ${choice} <amount|all|half>`
            }, { quoted: message });
        }

        const eco = getEco(sender);
        const wallet = eco.wallet || 0;
        let bet;

        if (amountArg === 'all') bet = wallet;
        else if (amountArg === 'half') bet = Math.floor(wallet / 2);
        else bet = parseInt(amountArg, 10);

        if (!bet || bet < MIN_BET) {
            return sock.sendMessage(from, {
                text: `❌ Minimum bet is *${fmtCoins(MIN_BET)} coins*.`
            }, { quoted: message });
        }

        const maxBet = Math.floor(wallet * MAX_BET_PCT);
        if (bet > wallet) {
            return sock.sendMessage(from, {
                text: `❌ Not enough coins.\n💰 Wallet: ${fmtCoins(wallet)} coins`
            }, { quoted: message });
        }

        if (bet > maxBet && wallet > MIN_BET * 2) {
            return sock.sendMessage(from, {
                text: `❌ Max bet is 50% of your wallet (*${fmtCoins(maxBet)} coins*).`
            }, { quoted: message });
        }

        const normalised = choice === 'h' ? 'heads' : choice === 't' ? 'tails' : choice;
        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        const won = normalised === result;
        const COIN_FACES = { heads: '👑', tails: '🪙' };

        if (won) {
            saveEco(sender, {
                wallet: wallet + bet,
                totalEarned: (eco.totalEarned || 0) + bet
            });
            await sock.sendMessage(from, {
                text: `${COIN_FACES[result]} *${result.toUpperCase()}!*\n\n✅ You won *+${fmtCoins(bet)} coins*!\n👛 Wallet: ${fmtCoins(wallet + bet)} coins`
            }, { quoted: message });
        } else {
            saveEco(sender, {
                wallet: wallet - bet,
                totalSpent: (eco.totalSpent || 0) + bet
            });
            await sock.sendMessage(from, {
                text: `${COIN_FACES[result]} *${result.toUpperCase()}!*\n\n❌ You picked *${normalised}* and lost *-${fmtCoins(bet)} coins*.\n👛 Wallet: ${fmtCoins(wallet - bet)} coins`
            }, { quoted: message });
        }
    }
};
