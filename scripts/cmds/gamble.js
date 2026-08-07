import { getEco, saveEco, fmtCoins, addXp } from '../../src/utils/economyDB.js';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

const GAMES = [
    { name: '🎰 Slots', minMult: 0, maxMult: 3, emoji: '🎰' },
    { name: '🃏 Higher/Lower', minMult: -1, maxMult: 2, emoji: '🃏' },
    { name: '🎡 Wheel', minMult: -0.5, maxMult: 4, emoji: '🎡' },
];

export default {
    config: {
        name: 'gamble',
        aliases: ['bet', 'gambling'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Gamble your coins',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}gamble <amount> [slots|hl|wheel]' },
    },
    async onStart({ args, sender, reply }) {
        const amount = parseInt(args[0]);
        if (!amount || amount <= 0 || isNaN(amount)) return reply('Usage: gamble <amount> [slots|hl|wheel]');

        const eco = getEco(sender);
        if ((eco.wallet || 0) < amount) return reply(`You need ${fmtCoins(amount)} but have ${fmtCoins(eco.wallet || 0)}.`);

        const gameType = (args[1] || 'slots').toLowerCase();
        let game;
        if (gameType === 'hl' || gameType === 'higher') game = GAMES[1];
        else if (gameType === 'wheel') game = GAMES[2];
        else game = GAMES[0];

        const multiplier = rand(game.minMult * 10, game.maxMult * 10) / 10;
        const change = Math.round(amount * multiplier);
        const { xp, level } = addXp(eco, change > 0 ? 40 : 15);

        const newWallet = (eco.wallet || 0) + change;
        saveEco(sender, { wallet: Math.max(0, newWallet), xp, level });

        reply([
            `${game.emoji} *${game.name}*`,
            '',
            `Bet: ${fmtCoins(amount)}`,
            `Result: ${change >= 0 ? '+' : ''}${fmtCoins(change)}`,
            `Wallet: ${fmtCoins(Math.max(0, newWallet))}`,
        ].join('\n'));
    },
};
