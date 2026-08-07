import { getEco, fmtCoins } from '../../src/utils/economyDB.js';
export default {
    config: { name: 'inventory', aliases: ['inv', 'bag', 'items'], author: 'Broken_vzn', version: '1.0',
        shortDescription: 'View your inventory', category: 'economy', coolDown: 3, role: 0,
        guide: { en: '{prefix}inventory' } },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const inv = eco.inventory || [];
        if (!inv.length) return reply('Your inventory is empty.\nBuy items from the shop: shop');
        const grouped = {};
        inv.forEach(item => { grouped[item] = (grouped[item] || 0) + 1; });
        let text = 'Your Inventory\n\n';
        Object.entries(grouped).forEach(([item, count]) => { text += `${item} x${count}\n`; });
        reply(text.trim());
    },
};
