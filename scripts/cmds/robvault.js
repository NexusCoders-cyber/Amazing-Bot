import { getEco, saveEco, fmtCoins, fmtTime, cooldownLeft, addXp } from '../../src/utils/economyDB.js';

const CD = 60 * 60 * 1000; // 1 hour
const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

export default {
    config: {
        name: 'robvault',
        aliases: ['vaultrob', 'breakvault'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Rob someone\'s bank vault',
        category: 'economy',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}robvault @user' },
    },
    async onStart({ message, sender, reply, isGroup }) {
        if (!isGroup) return reply('Group only.');

        const target = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!target) return reply('Mention someone to rob their vault.\nUsage: robvault @user');
        if (target === sender) return reply('You can\'t rob your own vault 🤦');

        const eco = getEco(sender);
        const targetEco = getEco(target);

        const left = cooldownLeft(eco.lastRob, CD);
        if (left > 0) return reply(`Cooldown: ${fmtTime(left)}`);

        const vault = targetEco.bank || 0;
        if (vault < 100) return reply('Their vault is empty. Nothing to steal.');

        const success = Math.random() < 0.4; // 40% success rate
        const { xp, level } = addXp(eco, success ? 75 : 25);

        if (success) {
            const stolen = rand(Math.floor(vault * 0.1), Math.floor(vault * 0.3));
            saveEco(sender, { wallet: (eco.wallet || 0) + stolen, bank: eco.bank, lastRob: Date.now(), xp, level });
            saveEco(target, { bank: vault - stolen });
            reply([
                '🔓 *VAULT BROKEN!*',
                '',
                `Stole ${fmtCoins(stolen)} from the vault!`,
                `Your wallet: ${fmtCoins((eco.wallet || 0) + stolen)}`,
            ].join('\n'));
        } else {
            const fine = rand(500, 2000);
            saveEco(sender, { wallet: Math.max(0, (eco.wallet || 0) - fine), lastRob: Date.now(), xp, level });
            reply([
                '🚨 *CAUGHT!*',
                '',
                `Security caught you! Fine: ${fmtCoins(fine)}`,
                `Your wallet: ${fmtCoins(Math.max(0, (eco.wallet || 0) - fine))}`,
            ].join('\n'));
        }
    },
};
