import { getEco, fmtCoins, hasEffect } from '../../src/utils/economyDB.js';

const ITEMS = {
    'fishingrod': { name: 'Fishing Rod 🎣', desc: 'Better fish catches. Boosts fish income.', price: 5000, category: 'Tools' },
    'luckycharm': { name: 'Lucky Charm 🍀', desc: 'Increases luck in activities.', price: 3000, category: 'Boosters' },
    'pickaxe': { name: 'Pickaxe ⛏️', desc: 'Better mining yields.', price: 4000, category: 'Tools' },
    'energydrink': { name: 'Energy Drink ⚡', desc: 'Reduces cooldowns by 50%.', price: 2000, category: 'Consumables' },
    'shovel': { name: 'Shovel 🪏', desc: 'Unlocks the dig command.', price: 7500, category: 'Tools' },
    'shield': { name: 'Shield 🛡️', desc: 'Protects from one robbery.', price: 10000, category: 'Defense' },
    'treasuremap': { name: 'Treasure Map 🗺️', desc: 'Find hidden treasure while digging.', price: 15000, category: 'Special' },
    'bomb': { name: 'Bomb 💣', desc: 'Blow up someone\'s mining profits.', price: 8000, category: 'Offensive' },
    'gem': { name: 'Gem 💎', desc: 'A rare gem. Can be sold for coins.', price: 25000, category: 'Valuables' },
    'mysterybox': { name: 'Mystery Box 🎁', desc: 'Contains a random item or coins.', price: 5000, category: 'Special' },
};

export default {
    config: {
        name: 'iteminfo',
        aliases: ['item', 'itemdetails'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get info about an item',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}iteminfo <item name> | {prefix}iteminfo list' },
    },
    async onStart({ args, sender, reply }) {
        const sub = (args[0] || '').toLowerCase();

        if (sub === 'list' || !args.length) {
            const list = Object.entries(ITEMS).map(([id, item]) =>
                `*${item.name}* (${id})\n  ${item.desc}\n  Price: ${fmtCoins(item.price)}`
            ).join('\n\n');
            return reply(`📦 *ITEM CATALOG*\n\n${list}`);
        }

        const query = args.join(' ').toLowerCase().replace(/\s+/g, '');
        const item = ITEMS[query];
        if (!item) return reply('Item not found. Use: iteminfo list');

        const eco = getEco(sender);
        const owned = (eco.inventory || []).filter(i => i === query).length;

        reply([
            `${item.name}`,
            '',
            `Category: ${item.category}`,
            `Price: ${fmtCoins(item.price)}`,
            `Description: ${item.desc}`,
            `Owned: ${owned}`,
        ].join('\n'));
    },
};
