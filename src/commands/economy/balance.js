import { getEco, fmtCoins, hasEffect, cleanEffects, saveEco } from '../../utils/economyDB.js';

export default {
    name: 'balance',
    aliases: ['bal', 'wallet', 'money', 'coins'],
    category: 'economy',
    description: 'Check your balance or someone else\'s balance',
    usage: 'balance [@user]',
    example: 'balance\nbalance @someone',
    cooldown: 3,
    permissions: ['user'],

    async execute({ sock, message, args, from, sender, prefix }) {
        const mentioned = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        const targetId = mentioned || sender;
        const isSelf = targetId === sender;
        const phone = targetId.replace(/[^0-9]/g, '');

        const eco = getEco(targetId);
        const cleanedEffects = cleanEffects(eco);
        if (cleanedEffects.length !== (eco.activeEffects || []).length) {
            saveEco(targetId, { activeEffects: cleanedEffects });
        }

        const netWorth = (eco.wallet || 0) + (eco.bank || 0);
        const bankPct = eco.bankCapacity > 0 ? Math.round((eco.bank / eco.bankCapacity) * 100) : 0;
        const xpToNext = Math.pow((eco.level || 1), 2) * 100;
        const xpProgress = Math.min(eco.xp || 0, xpToNext);

        const activeEffects = cleanedEffects.map(e => {
            const left = Math.max(0, e.expiresAt - Date.now());
            const mins = Math.floor(left / 60000);
            const hrs = Math.floor(mins / 60);
            const timeStr = hrs > 0 ? `${hrs}h ${mins % 60}m` : `${mins}m`;
            return `  • ${e.id} — ${timeStr} left`;
        });

        const badges = (eco.badges || []).join(' ') || 'None';

        let text = `💰 *Balance${isSelf ? '' : ` — @${phone}`}*\n\n`;
        text += `👛 Wallet:   ${fmtCoins(eco.wallet)} coins\n`;
        text += `🏦 Bank:     ${fmtCoins(eco.bank)} / ${fmtCoins(eco.bankCapacity)} coins (${bankPct}%)\n`;
        text += `📊 Net Worth: ${fmtCoins(netWorth)} coins\n`;
        text += `\n`;
        text += `🏅 Level ${eco.level || 1}  •  ✨ XP: ${xpProgress} / ${xpToNext}\n`;
        text += `🔥 Daily Streak: ${eco.streak || 0} day${(eco.streak || 0) !== 1 ? 's' : ''}\n`;
        text += `💎 Diamonds: ${eco.diamonds || 0}  •  ⭐ Stars: ${eco.stars || 0}\n`;
        text += `🏷️ Badges: ${badges}\n`;

        if (activeEffects.length > 0) {
            text += `\n⚡ Active Effects:\n${activeEffects.join('\n')}`;
        }

        const mentions = mentioned ? [targetId] : [sender];
        await sock.sendMessage(from, { text, mentions }, { quoted: message });
    }
};
