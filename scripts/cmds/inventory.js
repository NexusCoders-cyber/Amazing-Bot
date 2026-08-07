import { getEco } from '../../src/utils/economyDB.js';

export default {
    config: {
        name: 'inventory',
        aliases: ['inv', 'bag', 'items'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'View your inventory',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}inventory' },
    },

    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const inv = eco.inventory || [];

        if (!inv.length) return reply('🎒 Your inventory is empty.\nVisit the shop: shop');

        const grouped = {};
        inv.forEach(item => { grouped[item] = (grouped[item] || 0) + 1; });

        const lines = Object.entries(grouped).map(([item, count]) => `• ${item} x${count}`);
        reply(`🎒 *Your Inventory*\n\n${lines.join('\n')}`);
    },
};
