import { getEco, saveEco, fmtCoins } from '../../utils/economyDB.js';
import { ITEMS, findItem } from '../../utils/shopItems.js';

export default {
    name: 'shop',
    aliases: ['store', 'market', 'buy'],
    category: 'economy',
    description: 'Browse the shop or buy items.',
    usage: 'shop [buy <item>]',
    example: 'shop\nshop buy shield\nshop buy laptop',
    cooldown: 3,
    permissions: ['user'],

    async execute({ sock, message, args, from, sender, prefix }) {
        const sub = args[0]?.toLowerCase();

        if (!sub || sub === 'list' || sub === 'browse') {
            const grouped = {
                timed: ITEMS.filter(i => i.type === 'timed'),
                consumable: ITEMS.filter(i => i.type === 'consumable'),
                permanent: ITEMS.filter(i => i.type === 'permanent'),
                cosmetic: ITEMS.filter(i => i.type === 'cosmetic')
            };

            let text = `🛒 *Shop*\n\n`;

            if (grouped.timed.length) {
                text += `⏱️ *Timed Boosts*\n`;
                grouped.timed.forEach(i => {
                    text += `  ${i.emoji} *${i.name}* — ${fmtCoins(i.price)} coins\n`;
                    text += `      ${i.description}\n`;
                });
                text += `\n`;
            }

            if (grouped.consumable.length) {
                text += `🎁 *Consumables*\n`;
                grouped.consumable.forEach(i => {
                    text += `  ${i.emoji} *${i.name}* — ${fmtCoins(i.price)} coins\n`;
                    text += `      ${i.description}\n`;
                });
                text += `\n`;
            }

            if (grouped.permanent.length) {
                text += `🏗️ *Permanent Upgrades*\n`;
                grouped.permanent.forEach(i => {
                    text += `  ${i.emoji} *${i.name}* — ${fmtCoins(i.price)} coins\n`;
                    text += `      ${i.description}\n`;
                });
                text += `\n`;
            }

            if (grouped.cosmetic.length) {
                text += `✨ *Cosmetics*\n`;
                grouped.cosmetic.forEach(i => {
                    text += `  ${i.emoji} *${i.name}* — ${fmtCoins(i.price)} coins\n`;
                    text += `      ${i.description}\n`;
                });
                text += `\n`;
            }

            text += `💡 To buy: *${prefix}shop buy <item name>*`;
            return sock.sendMessage(from, { text }, { quoted: message });
        }

        if (sub === 'buy') {
            const itemQuery = args.slice(1).join(' ').trim();
            if (!itemQuery) {
                return sock.sendMessage(from, {
                    text: `❌ Specify an item to buy.\nExample: ${prefix}shop buy shield`
                }, { quoted: message });
            }

            const item = findItem(itemQuery);
            if (!item) {
                return sock.sendMessage(from, {
                    text: `❌ Item *"${itemQuery}"* not found.\nUse *${prefix}shop* to browse available items.`
                }, { quoted: message });
            }

            const eco = getEco(sender);
            if ((eco.wallet || 0) < item.price) {
                return sock.sendMessage(from, {
                    text: `❌ Not enough coins.\n💰 You have: ${fmtCoins(eco.wallet)} coins\n💸 Costs:    ${fmtCoins(item.price)} coins`
                }, { quoted: message });
            }

            const inventory = [...(eco.inventory || [])];
            const existing = inventory.find(i => i.id === item.id);

            if (item.type === 'cosmetic' && existing) {
                return sock.sendMessage(from, {
                    text: `❌ You already own *${item.emoji} ${item.name}*.`
                }, { quoted: message });
            }

            if (item.type === 'permanent') {
                if (existing) {
                    return sock.sendMessage(from, {
                        text: `❌ You already have *${item.emoji} ${item.name}*. It's already applied.`
                    }, { quoted: message });
                }
                let newCapacity = eco.bankCapacity || 50000;
                if (item.id === 'bank_upgrade') newCapacity += 25000;
                if (item.id === 'vault') newCapacity += 100000;
                inventory.push({ id: item.id, name: item.name, emoji: item.emoji, quantity: 1 });
                saveEco(sender, {
                    wallet: (eco.wallet || 0) - item.price,
                    totalSpent: (eco.totalSpent || 0) + item.price,
                    bankCapacity: newCapacity,
                    inventory
                });
                return sock.sendMessage(from, {
                    text: `✅ *Purchased!*\n\n${item.emoji} *${item.name}*\n${item.description}\n\n💰 Spent: ${fmtCoins(item.price)} coins\n👛 Remaining: ${fmtCoins((eco.wallet || 0) - item.price)} coins`
                }, { quoted: message });
            }

            if (existing) {
                existing.quantity = (existing.quantity || 1) + 1;
            } else {
                inventory.push({ id: item.id, name: item.name, emoji: item.emoji, quantity: 1 });
            }

            saveEco(sender, {
                wallet: (eco.wallet || 0) - item.price,
                totalSpent: (eco.totalSpent || 0) + item.price,
                inventory
            });

            await sock.sendMessage(from, {
                text: `✅ *Purchased!*\n\n${item.emoji} *${item.name}*\n${item.description}\n\n💰 Spent: ${fmtCoins(item.price)} coins\n👛 Remaining: ${fmtCoins((eco.wallet || 0) - item.price)} coins\n\n💡 Use *${prefix}use ${item.id}* to activate it.`
            }, { quoted: message });
        }
    }
};
