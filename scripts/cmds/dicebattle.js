import { getEco, saveEco, fmtCoins, addXp } from '../../src/utils/economyDB.js';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

const DICE = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

export default {
    config: {
        name: 'dicebattle',
        aliases: ['dicewar', 'rollbattle'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Dice battle — highest roll wins',
        category: 'economy',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}dicebattle <bet amount>' },
    },
    async onStart({ args, sender, reply }) {
        const bet = parseInt(args[0]);
        if (!bet || bet <= 0 || isNaN(bet)) return reply('Usage: dicebattle <bet amount>');

        const eco = getEco(sender);
        if ((eco.wallet || 0) < bet) return reply(`You need ${fmtCoins(bet)} but have ${fmtCoins(eco.wallet || 0)}.`);

        const playerRoll = rand(1, 6);
        const botRoll = rand(1, 6);
        const { xp, level } = addXp(eco, 30);

        let result = `🎲 *DICE BATTLE*\n\n`;
        result += `You: ${DICE[playerRoll - 1]} (${playerRoll})\n`;
        result += `Bot: ${DICE[botRoll - 1]} (${botRoll})\n\n`;

        if (playerRoll > botRoll) {
            const win = bet * 2;
            saveEco(sender, { wallet: (eco.wallet || 0) + bet, xp, level });
            result += `🏆 You win ${fmtCoins(bet)}!\nWallet: ${fmtCoins((eco.wallet || 0) + bet)}`;
        } else if (playerRoll < botRoll) {
            saveEco(sender, { wallet: (eco.wallet || 0) - bet, xp, level });
            result += `💀 You lose ${fmtCoins(bet)}.\nWallet: ${fmtCoins((eco.wallet || 0) - bet)}`;
        } else {
            result += `🤝 It's a tie! No coins lost.`;
            saveEco(sender, { xp, level });
        }

        reply(result);
    },
};
