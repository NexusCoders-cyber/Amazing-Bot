import { getEco, saveEco, fmtCoins, addXp } from '../../src/utils/economyDB.js';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

const MOVES = ['👊 Punch', '🦶 Kick', '🦷 Headbutt', '🤚 Slap', '🪨 Rock Throw'];
const COMBOS = [
    'lands a devastating combo!',
    'dodges and counters!',
    'goes full Super Saiyan!',
    'pulls out a secret technique!',
    'gets lucky with a critical hit!',
];

export default {
    config: {
        name: 'fight',
        aliases: ['battle', 'duel'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Fight another user for coins',
        category: 'economy',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}fight @user [bet amount]' },
    },
    async onStart({ message, args, sender, reply, isGroup }) {
        if (!isGroup) return reply('Group only.');

        const target = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target) return reply('Mention someone to fight!\nUsage: fight @user [bet]');
        if (target === sender) return reply('Fight yourself? That\'s just shadow boxing 🥊');

        const bet = parseInt(args.find(a => /^\d+$/.test(a))) || 0;
        const eco = getEco(sender);
        const targetEco = getEco(target);

        if (bet > 0 && (eco.wallet || 0) < bet) return reply(`You need ${fmtCoins(bet)} but only have ${fmtCoins(eco.wallet || 0)}.`);
        if (bet > 0 && (targetEco.wallet || 0) < bet) return reply(`Opponent doesn't have ${fmtCoins(bet)}.`);

        const playerHP = rand(60, 100);
        const opponentHP = rand(60, 100);
        const playerWins = playerHP > opponentHP;

        const move1 = MOVES[rand(0, MOVES.length - 1)];
        const move2 = MOVES[rand(0, MOVES.length - 1)];
        const combo = COMBOS[rand(0, COMBOS.length - 1)];

        let result = `🥊 *FIGHT!*\n\n`;
        result += `@${sender.split('@')[0]} uses ${move1}!\n`;
        result += `@${target.split('@')[0]} uses ${move2}!\n\n`;
        result += `${combo}\n\n`;
        result += `HP: You ${playerHP} vs ${opponentHP} Opponent\n\n`;

        if (playerWins) {
            const prize = bet > 0 ? bet : rand(100, 1000);
            saveEco(sender, { wallet: (eco.wallet || 0) + prize });
            if (bet > 0) saveEco(target, { wallet: (targetEco.wallet || 0) - prize });
            result += `🏆 *YOU WIN!* +${fmtCoins(prize)}`;
        } else {
            const loss = bet > 0 ? bet : rand(100, 1000);
            saveEco(sender, { wallet: Math.max(0, (eco.wallet || 0) - loss) });
            if (bet > 0) saveEco(target, { wallet: (targetEco.wallet || 0) + loss });
            result += `💀 *YOU LOSE!* -${fmtCoins(loss)}`;
        }

        reply(result);
    },
};
