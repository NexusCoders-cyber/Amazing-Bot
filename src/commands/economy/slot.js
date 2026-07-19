import { getEco, saveEco, fmtCoins } from '../../utils/economyDB.js';

const MIN_BET = 50;

const REELS = ['🍒', '🍋', '🍊', '🍇', '⭐', '💎', '7️⃣'];
const WEIGHTS = [30, 25, 20, 15, 6, 3, 1];

const PAYOUTS = {
    '7️⃣7️⃣7️⃣': 50,
    '💎💎💎': 25,
    '⭐⭐⭐': 15,
    '🍇🍇🍇': 10,
    '🍊🍊🍊': 8,
    '🍋🍋🍋': 5,
    '🍒🍒🍒': 3,
    'two7': 2,
    'twoDiamond': 1.5,
    'twoStar': 1,
    'anythree': 0
};

function weightedRand() {
    const total = WEIGHTS.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < REELS.length; i++) {
        r -= WEIGHTS[i];
        if (r <= 0) return REELS[i];
    }
    return REELS[REELS.length - 1];
}

function spin() {
    return [weightedRand(), weightedRand(), weightedRand()];
}

function calcPayout(reels, bet) {
    const [a, b, c] = reels;
    const key = `${a}${b}${c}`;

    if (PAYOUTS[key] !== undefined) return { mult: PAYOUTS[key], label: key };

    if (a === b && b === c) return { mult: 3, label: 'three of a kind' };

    if (a === '7️⃣' && b === '7️⃣') return { mult: PAYOUTS.two7, label: 'two 7s' };
    if (a === '💎' && b === '💎') return { mult: PAYOUTS.twoDiamond, label: 'two 💎' };
    if (a === '⭐' && b === '⭐') return { mult: PAYOUTS.twoStar, label: 'two ⭐' };
    if (b === c && b === '7️⃣') return { mult: PAYOUTS.two7, label: 'two 7s' };
    if (b === c && b === '💎') return { mult: PAYOUTS.twoDiamond, label: 'two 💎' };

    if (a === b || b === c || a === c) return { mult: 0.5, label: 'one pair' };

    return { mult: 0, label: 'no match' };
}

export default {
    name: 'slot',
    aliases: ['slots', 'slotmachine', 'spin'],
    category: 'economy',
    description: 'Spin the slot machine. Match symbols to multiply your bet.',
    usage: 'slot <amount|all|half>',
    example: 'slot 200\nslot all',
    cooldown: 5,
    permissions: ['user'],

    async execute({ sock, message, args, from, sender, prefix }) {
        if (!args[0]) {
            let text = `🎰 *Slot Machine*\n\n`;
            text += `*Payouts (multiplier × bet):*\n`;
            text += `7️⃣7️⃣7️⃣ → 50x\n`;
            text += `💎💎💎 → 25x\n`;
            text += `⭐⭐⭐ → 15x\n`;
            text += `🍇🍇🍇 → 10x\n`;
            text += `🍊🍊🍊 → 8x\n`;
            text += `🍋🍋🍋 → 5x\n`;
            text += `🍒🍒🍒 → 3x\n`;
            text += `Three-of-a-kind → 3x\n`;
            text += `One pair → 0.5x (get half back)\n`;
            text += `No match → 0x\n\n`;
            text += `Usage: *${prefix}slot <amount|all|half>*`;
            return sock.sendMessage(from, { text }, { quoted: message });
        }

        const eco = getEco(sender);
        const wallet = eco.wallet || 0;
        const raw = args[0].toLowerCase();

        let bet;
        if (raw === 'all') bet = wallet;
        else if (raw === 'half') bet = Math.floor(wallet / 2);
        else bet = parseInt(raw, 10);

        if (!bet || bet < MIN_BET) {
            return sock.sendMessage(from, {
                text: `❌ Minimum bet is *${fmtCoins(MIN_BET)} coins*.`
            }, { quoted: message });
        }

        if (bet > wallet) {
            return sock.sendMessage(from, {
                text: `❌ Not enough coins.\n💰 Wallet: ${fmtCoins(wallet)} coins`
            }, { quoted: message });
        }

        const reels = spin();
        const { mult, label } = calcPayout(reels, bet);
        const winnings = Math.floor(bet * mult);
        const net = winnings - bet;
        const newWallet = wallet + net;

        if (net > 0) {
            saveEco(sender, {
                wallet: newWallet,
                totalEarned: (eco.totalEarned || 0) + net
            });
        } else if (net < 0) {
            saveEco(sender, {
                wallet: newWallet,
                totalSpent: (eco.totalSpent || 0) + Math.abs(net)
            });
        }

        let text = `🎰 *Slot Machine*\n\n`;
        text += `┌─────────────────┐\n`;
        text += `│  ${reels[0]}  ${reels[1]}  ${reels[2]}  │\n`;
        text += `└─────────────────┘\n\n`;
        text += `Result: *${label}*  (${mult}x)\n`;

        if (net > 0) {
            text += `✅ You won *+${fmtCoins(winnings)} coins*! (net +${fmtCoins(net)})\n`;
        } else if (net === 0) {
            text += `😐 You broke even.\n`;
        } else {
            text += `❌ You lost *-${fmtCoins(Math.abs(net))} coins*.\n`;
        }

        text += `👛 Wallet: ${fmtCoins(newWallet)} coins`;

        await sock.sendMessage(from, { text }, { quoted: message });
    }
};
