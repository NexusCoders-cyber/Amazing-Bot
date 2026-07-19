import { getAllEco, fmtCoins } from '../../utils/economyDB.js';

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

export default {
    name: 'leaderboard',
    aliases: ['lb', 'top', 'rich', 'richest'],
    category: 'economy',
    description: 'View the top 10 richest users by net worth.',
    usage: 'leaderboard',
    example: 'leaderboard',
    cooldown: 10,
    permissions: ['user'],

    async execute({ sock, message, from, sender }) {
        const all = getAllEco();

        const sorted = all
            .map(u => ({ ...u, netWorth: (u.wallet || 0) + (u.bank || 0) }))
            .filter(u => u.netWorth > 0)
            .sort((a, b) => b.netWorth - a.netWorth)
            .slice(0, 10);

        if (sorted.length === 0) {
            return sock.sendMessage(from, {
                text: `📊 No economy data yet. Use .daily to get started!`
            }, { quoted: message });
        }

        const senderPhone = sender.replace(/[^0-9]/g, '');
        const senderRank = all
            .map(u => ({ ...u, netWorth: (u.wallet || 0) + (u.bank || 0) }))
            .sort((a, b) => b.netWorth - a.netWorth)
            .findIndex(u => u.phone === senderPhone);

        let text = `🏆 *Economy Leaderboard*\n\n`;

        sorted.forEach((u, i) => {
            const medal = MEDALS[i] || `${i + 1}.`;
            const name = u.phone || 'Unknown';
            const isYou = u.phone === senderPhone;
            text += `${medal} ${fmtCoins(u.netWorth)} coins${isYou ? ' ← you' : ''}\n`;
            text += `    👤 +${name}\n`;
        });

        if (senderRank > 9) {
            const senderData = all.find(u => u.phone === senderPhone);
            const senderNet = senderData ? (senderData.wallet || 0) + (senderData.bank || 0) : 0;
            text += `\n📍 Your rank: *#${senderRank + 1}* with ${fmtCoins(senderNet)} coins`;
        }

        await sock.sendMessage(from, { text }, { quoted: message });
    }
};
