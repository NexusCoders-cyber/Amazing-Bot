import { getEco, saveEco, fmtCoins } from '../../src/utils/economyDB.js';

const ITEMS = [
    { id: 'fishingrod', name: 'Fishing Rod', price: 500, desc: 'Better fish catches' },
    { id: 'gun', name: 'Gun', price: 800, desc: 'Better hunt success rate' },
    { id: 'pickaxe', name: 'Pickaxe', price: 600, desc: 'Mine more valuable ores' },
    { id: 'shield', name: 'Shield', price: 400, desc: 'Reduces rob losses' },
    { id: 'laptop', name: 'Laptop', price: 1500, desc: 'Higher work earnings' },
    { id: 'bankpass', name: 'Bank Pass', price: 2000, desc: '+10000 bank capacity' },
];

export default {
    config: {
        name: 'shop',
        aliases: ['store', 'buy'],
        author: 'Raphael Ilom',
        version: '2.0',
        shortDescription: 'Buy items from the shop',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}shop | {prefix}shop buy <item id>' },
    },

    async onStart({ args, sender, reply }) {
        const sub = (args[0] || '').toLowerCase();

        if (sub === 'buy') {
            const itemId = (args[1] || '').toLowerCase();
            const item = ITEMS.find(i => i.id === itemId);
            if (!item) return reply('❌ Item not found. Use *shop* to see available items.');

            const eco = getEco(sender);
            const wallet = eco.wallet || 0;
            if (wallet < item.price) return reply(`❌ You need ${fmtCoins(item.price)}. You have ${fmtCoins(wallet)}.`);

            const newWallet = wallet - item.price;

            if (item.id === 'bankpass') {
                const newCap = (eco.bankCapacity || 50000) + 10000;
                saveEco(sender, { wallet: newWallet, bankCapacity: newCap });
                return reply(`✅ Bought *Bank Pass*!\nBank capacity: ${fmtCoins(newCap)}`);
            }

            const inv = [...(eco.inventory || []), item.id];
            saveEco(sender, { wallet: newWallet, inventory: inv });
            return reply(`✅ Bought *${item.name}*!\nWallet: ${fmtCoins(newWallet)}`);
        }

        let text = '🛒 *Shop*\n\n';
        ITEMS.forEach(i => { text += `${i.id} — ${i.name}\n  Price: ${fmtCoins(i.price)}\n  ${i.desc}\n\n`; });
        text += 'Buy with: shop buy <id>';
        reply(text.trim());
    },
};
