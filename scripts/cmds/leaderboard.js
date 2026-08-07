import { getAllEco, fmtCoins } from '../../src/utils/economyDB.js';
import usersData from '../../src/utils/usersData.js';

export default {
    config: {
        name: 'leaderboard',
        aliases: ['lb', 'rich', 'top'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Top 10 richest users',
        category: 'economy',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}leaderboard' },
    },
    async onStart({ reply }) {
        const all = getAllEco();
        const sorted = Object.entries(all)
            .map(([id, eco]) => ({ id, net: (eco.wallet || 0) + (eco.bank || 0), ecoName: eco.name }))
            .sort((a, b) => b.net - a.net).slice(0, 10);

        if (!sorted.length) return reply('No economy data yet.');

        const rows = await Promise.all(sorted.map(async (u) => {
            let name = u.ecoName;
            if (!name) {
                const user = await usersData.get(u.id);
                name = user?.name || null;
            }
            return { ...u, name: name || `+${u.id}` };
        }));

        const medals = ['🥇', '🥈', '🥉'];
        let text = 'Top 10 Richest Users\n\n';
        rows.forEach((u, i) => {
            text += `${medals[i] || `${i + 1}.`} ${u.name} - ${fmtCoins(u.net)}\n`;
        });
        reply(text.trim());
    },
};
