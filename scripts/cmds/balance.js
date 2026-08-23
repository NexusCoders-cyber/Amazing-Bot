import { getEco, fmtCoins, cleanEffects, saveEco, resolveTarget, displayPhone } from '../../src/utils/economyDB.js';
import usersData from '../../src/utils/usersData.js';

export default {
    config: {
        name: 'balance',
        aliases: ['bal', 'wallet', 'money', 'coins'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Check your balance or someone else\'s',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}balance [@user]' },
    },

    async onStart({ message, sender, reply }) {
        const target = resolveTarget(message, sender);
        const phone = displayPhone(target);

        const eco = getEco(target);
        const effects = cleanEffects(eco);
        if (effects.length !== (eco.activeEffects || []).length) saveEco(target, { activeEffects: effects });

        const user = await usersData.get(phone);
        const name = eco.name || user?.name || `+${phone}`;
        const net = (eco.wallet || 0) + (eco.bank || 0);

        reply(
            `💰 *Balance — ${name}*\n\n` +
            `Wallet    : ${fmtCoins(eco.wallet || 0)}\n` +
            `Bank      : ${fmtCoins(eco.bank || 0)} / ${fmtCoins(eco.bankCapacity || 50000)}\n` +
            `Net Worth : ${fmtCoins(net)}\n` +
            `Level     : ${eco.level || 1}  (${eco.xp || 0} XP)\n` +
            `Badges    : ${(eco.badges || []).join(' ') || 'none'}`
        );
    },
};
