import { getEco, saveEco, fmtCoins, addXp } from '../../src/utils/economyDB.js';

const activeDuels = new Map();

export default {
    config: {
        name: 'battle',
        aliases: ['fight', 'duel'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Battle another user for coins',
        category: 'games',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}battle @user [amount]' },
    },

    async onStart({ args, reply, sender, prefix, message, React }) {
        React('⚔️');

        const target = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target || target === sender) {
            return reply(`Mention someone to battle!\nUsage: ${prefix}battle @user [amount]`);
        }

        const amount = parseInt(args.find(a => !a.startsWith('@'))) || 100;
        if (amount < 10) return reply(`Minimum bet is *10 coins*!`);

        const senderEco = getEco(sender);
        const targetEco = getEco(target);

        if ((senderEco.wallet || 0) < amount) return reply(`You need *${fmtCoins(amount)}* in your wallet!`);
        if ((targetEco.wallet || 0) < amount) return reply(`@${target.split('@')[0]} doesn't have enough coins!`);

        if (activeDuels.has(sender)) return reply(`You already have a pending duel!`);

        const fightMoves = ['⚔️ Slash', '🛡️ Block', '🗡️ Stab', '🏹 Shoot', '👊 Punch', '🦶 Kick', '🔥 Fire Blast', '⚡ Lightning'];

        const senderHP = 100 + Math.floor(Math.random() * 50);
        const targetHP = 100 + Math.floor(Math.random() * 50);
        let senderCurrent = senderHP;
        let targetCurrent = targetHP;

        let battleLog = `━━━━━━━━━━━━━━━━━━━━\n  ⚔️ *BATTLE*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
        battleLog += `@${sender.split('@')[0]} (${senderHP} HP) vs @${target.split('@')[0]} (${targetHP} HP)\n`;
        battleLog += `💰 Bet: *${fmtCoins(amount)}*\n\n`;

        const rounds = 5;
        for (let i = 0; i < rounds; i++) {
            const sMove = fightMoves[Math.floor(Math.random() * fightMoves.length)];
            const tMove = fightMoves[Math.floor(Math.random() * fightMoves.length)];
            const sDmg = Math.floor(Math.random() * 30) + 5;
            const tDmg = Math.floor(Math.random() * 30) + 5;

            targetCurrent -= sDmg;
            senderCurrent -= tDmg;

            battleLog += `*Round ${i + 1}:*\n`;
            battleLog += `  ${sMove} → -${sDmg} HP\n`;
            battleLog += `  ${tMove} → -${tDmg} HP\n\n`;
        }

        let winner, loser;
        if (senderCurrent > targetCurrent) {
            winner = sender; loser = target;
        } else if (targetCurrent > senderCurrent) {
            winner = target; loser = sender;
        } else {
            return reply(battleLog + `🤝 *DRAW!* No coins exchanged.`);
        }

        const winEco = getEco(winner);
        const loseEco = getEco(loser);
        saveEco(winner, { wallet: (winEco.wallet || 0) + amount, totalEarned: (winEco.totalEarned || 0) + amount });
        saveEco(loser, { wallet: (loseEco.wallet || 0) - amount });

        battleLog += `━━━━━━━━━━━━━━━━━━━━\n`;
        battleLog += `🏆 Winner: @${winner.split('@')[0]}!\n`;
        battleLog += `💰 Won: *${fmtCoins(amount)}*\n`;
        battleLog += `━━━━━━━━━━━━━━━━━━━━`;

        reply({ text: battleLog, mentions: [sender, target] });
    },
};
