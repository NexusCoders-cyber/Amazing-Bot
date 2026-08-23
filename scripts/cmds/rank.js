import {
    getEco,
    saveEco,
    getAllEco,
    fmtCoins,
    cleanEffects,
    resolveTarget,
    displayPhone,
    levelProgress
} from '../../src/utils/economyDB.js';
import usersData from '../../src/utils/usersData.js';
import { createRankCard } from '../../src/utils/canvasUtils.js';

async function computeRankPosition(sock, from, isGroup, targetKey) {
    const allEco = getAllEco();
    let scope = Object.entries(allEco);
    let scopeLabel = null;

    if (isGroup) {
        try {
            const meta = await sock.groupMetadata(from);
            const participantKeys = new Set(
                (meta?.participants || []).map(p => displayPhone(p.id)).filter(Boolean)
            );
            if (participantKeys.size) {
                scope = scope.filter(([id]) => participantKeys.has(id));
                scopeLabel = meta?.subject || null;
            }
        } catch {}
    }

    const ranked = scope
        .map(([id, eco]) => ({ id, net: (eco.wallet || 0) + (eco.bank || 0) }))
        .sort((a, b) => b.net - a.net);

    const idx = ranked.findIndex(u => u.id === targetKey);

    return {
        position: idx >= 0 ? idx + 1 : null,
        total: ranked.length,
        scopeLabel
    };
}

export default {
    config: {
        name: 'rank',
        aliases: ['level', 'lvl', 'rankcard'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'View your or someone else\'s rank card',
        category: 'economy',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}rank [@user]' },
    },

    async onStart({ sock, message, from, sender, isGroup, reply }) {
        const target = resolveTarget(message, sender);
        const phone = displayPhone(target);

        const eco = getEco(target);
        const effects = cleanEffects(eco);
        if (effects.length !== (eco.activeEffects || []).length) saveEco(target, { activeEffects: effects });

        const user = await usersData.get(phone);
        let avatar = null;
        try { avatar = await sock.profilePictureUrl(target, 'image'); } catch {}

        const name = eco.name || user?.name || message.pushName || `+${phone}`;
        const level = eco.level || 1;
        const { into, needed, percent } = levelProgress(level, eco.xp || 0);
        const { position, total, scopeLabel } = await computeRankPosition(sock, from, isGroup, phone);

        const card = await createRankCard({
            name,
            avatarUrl: avatar,
            level,
            xpInto: into,
            xpNeeded: needed,
            percent,
            walletText: fmtCoins(eco.wallet || 0),
            bankText: fmtCoins(eco.bank || 0),
            netWorthText: fmtCoins((eco.wallet || 0) + (eco.bank || 0)),
            rankPosition: position,
            totalRanked: total,
            groupName: isGroup ? scopeLabel : null
        });

        const caption = [
            `🎖️ *Rank — ${name}*`,
            `Level ${level}  ·  ${into}/${needed} XP`,
            position ? `Position: #${position} of ${total}${scopeLabel ? ` in ${scopeLabel}` : ''}` : null
        ].filter(Boolean).join('\n');

        if (card) {
            await sock.sendMessage(from, { image: card, caption, mentions: [target] }, { quoted: message });
        } else {
            await sock.sendMessage(from, { text: caption, mentions: [target] }, { quoted: message });
        }
    },
};
