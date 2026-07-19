import { getEco, saveEco, addEffect, fmtCoins } from '../../utils/economyDB.js';
import { findItem } from '../../utils/shopItems.js';

const LOTTERY_PRIZES = [
    { label: '💀 Nothing',        chance: 0.40, min: 0,     max: 0 },
    { label: '🎁 Small win',      chance: 0.30, min: 100,   max: 500 },
    { label: '💰 Medium win',     chance: 0.18, min: 500,   max: 2000 },
    { label: '💎 Big win',        chance: 0.09, min: 2000,  max: 6000 },
    { label: '🏆 Jackpot',        chance: 0.03, min: 6000,  max: 10000 }
];

function rollLottery() {
    const r = Math.random();
    let sum = 0;
    for (const prize of LOTTERY_PRIZES) {
        sum += prize.chance;
        if (r < sum) return prize;
    }
    return LOTTERY_PRIZES[0];
}

function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default {
    name: 'use',
    aliases: ['activate', 'equip'],
    category: 'economy',
    description: 'Use an item from your inventory.',
    usage: 'use <item>',
    example: 'use shield\nuse coffee\nuse lottery',
    cooldown: 3,
    permissions: ['user'],

    async execute({ sock, message, args, from, sender, prefix }) {
        if (!args[0]) {
            return sock.sendMessage(from, {
                text: `❌ Specify an item to use.\nExample: ${prefix}use shield\n\nCheck your items with *${prefix}inventory*`
            }, { quoted: message });
        }

        const itemQuery = args.join(' ').toLowerCase().trim();
        const item = findItem(itemQuery);

        if (!item) {
            return sock.sendMessage(from, {
                text: `❌ Item *"${itemQuery}"* not found.\nCheck your inventory with *${prefix}inventory*`
            }, { quoted: message });
        }

        const eco = getEco(sender);
        const inventory = [...(eco.inventory || [])];
        const idx = inventory.findIndex(i => i.id === item.id);

        if (idx === -1) {
            return sock.sendMessage(from, {
                text: `❌ You don't own *${item.emoji} ${item.name}*.\nBuy it from the shop with *${prefix}shop buy ${item.id}*`
            }, { quoted: message });
        }

        if (item.type === 'permanent' || item.type === 'cosmetic') {
            return sock.sendMessage(from, {
                text: `ℹ️ *${item.emoji} ${item.name}* is a permanent item — it's already applied to your account.`
            }, { quoted: message });
        }

        inventory[idx].quantity = (inventory[idx].quantity || 1) - 1;
        if (inventory[idx].quantity <= 0) inventory.splice(idx, 1);

        if (item.type === 'timed') {
            const effects = addEffect(eco, item.id, item.duration);
            saveEco(sender, { inventory, activeEffects: effects });
            const hrs = Math.floor(item.duration / 3600000);
            const mins = Math.floor((item.duration % 3600000) / 60000);
            const timeStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
            return sock.sendMessage(from, {
                text: `✅ *${item.emoji} ${item.name}* activated!\n\n${item.description}\n⏱️ Duration: ${timeStr}`
            }, { quoted: message });
        }

        if (item.id === 'lucky_charm') {
            const effects = addEffect(eco, 'lucky_charm_daily', 7 * 24 * 3600000);
            saveEco(sender, { inventory, activeEffects: effects });
            return sock.sendMessage(from, {
                text: `✅ *🍀 Lucky Charm* activated!\nYour next daily claim will earn +50% bonus.`
            }, { quoted: message });
        }

        if (item.id === 'coffee') {
            const effects = addEffect(eco, 'coffee_active', 600000);
            saveEco(sender, { inventory, activeEffects: effects });
            return sock.sendMessage(from, {
                text: `✅ *☕ Coffee* consumed!\nYour work cooldown is reduced by 10 minutes.`
            }, { quoted: message });
        }

        if (item.id === 'lottery') {
            const prize = rollLottery();
            let winAmount = 0;
            let resultText = '';

            if (prize.min > 0) {
                winAmount = rand(prize.min, prize.max);
                saveEco(sender, {
                    inventory,
                    wallet: (eco.wallet || 0) + winAmount,
                    totalEarned: (eco.totalEarned || 0) + winAmount
                });
                resultText = `You won *${fmtCoins(winAmount)} coins*!\n👛 Wallet: ${fmtCoins((eco.wallet || 0) + winAmount)} coins`;
            } else {
                saveEco(sender, { inventory });
                resultText = `Better luck next time!`;
            }

            return sock.sendMessage(from, {
                text: `🎟️ *Lottery Scratch!*\n\nResult: ${prize.label}\n${resultText}`
            }, { quoted: message });
        }

        saveEco(sender, { inventory });
        await sock.sendMessage(from, {
            text: `✅ Used *${item.emoji} ${item.name}*!`
        }, { quoted: message });
    }
};
