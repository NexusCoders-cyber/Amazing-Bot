import { getEco, fmtCoins, cleanEffects, saveEco } from '../../src/utils/economyDB.js';
export default {
    config: { name: 'balance', aliases: ['bal', 'wallet', 'money', 'coins'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'Check your balance or someone else\'s', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}balance [@user]' } },
    async onStart({ message, from, sender, reply }) {
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const target = mentioned || sender;
        const phone = target.replace(/[^0-9]/g, '');
        const eco = getEco(target);
        const effects = cleanEffects(eco);
        if (effects.length !== (eco.activeEffects || []).length) saveEco(target, { activeEffects: effects });
        const net = (eco.wallet || 0) + (eco.bank || 0);
        reply([
            `Balance — @${phone}`,
            ``,
            `Wallet   : ${fmtCoins(eco.wallet || 0)}`,
            `Bank     : ${fmtCoins(eco.bank || 0)} / ${fmtCoins(eco.bankCapacity || 50000)}`,
            `Net Worth: ${fmtCoins(net)}`,
            `Level    : ${eco.level || 1}`,
            `XP       : ${eco.xp || 0}`,
            `Badges   : ${(eco.badges || []).join(' ') || 'none'}`,
        ].join('\n'));
    },
};
