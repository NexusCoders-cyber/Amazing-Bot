import { getEco, saveEco, addXp } from '../../src/utils/economyDB.js';

const ITEMS = {
    'fishingrod': { name: 'Fishing Rod', desc: 'Better fish catches', effect: 'fish_boost', duration: 3600000 },
    'luckycharm': { name: 'Lucky Charm', desc: 'Increases luck in all activities', effect: 'luck_boost', duration: 3600000 },
    'pickaxe': { name: 'Pickaxe', desc: 'Better mining yields', effect: 'mine_boost', duration: 3600000 },
    'energydrink': { name: 'Energy Drink', desc: 'Reduces cooldowns', effect: 'cooldown_reduce', duration: 1800000 },
    'shovel': { name: 'Shovel', desc: 'Required for digging', effect: 'dig_enabled', duration: 0 },
    'shield': { name: 'Shield', desc: 'Protects from robbery once', effect: 'rob_protection', duration: 0 },
};

export default {
    config: {
        name: 'use',
        aliases: ['useitem', 'activate'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Use an item from your inventory',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}use <item name>' },
    },
    async onStart({ args, sender, reply }) {
        if (!args.length) {
            const itemNames = Object.keys(ITEMS).map(i => `• ${i}`).join('\n');
            return reply(`Available items:\n${itemNames}`);
        }

        const itemId = args.join(' ').toLowerCase().replace(/\s+/g, '');
        const item = ITEMS[itemId];
        if (!item) return reply('Unknown item. Check shop for available items.');

        const eco = getEco(sender);
        const inv = eco.inventory || [];
        const idx = inv.indexOf(itemId);
        if (idx === -1) return reply(`You don't have a ${item.name}.`);

        // Remove from inventory
        inv.splice(idx, 1);

        if (item.effect === 'dig_enabled') {
            // Permanent effect
            const badges = [...(eco.badges || [])];
            if (!badges.includes('digger')) badges.push('digger');
            saveEco(sender, { inventory: inv, badges });
            return reply(`⛏️ Shovel activated! You can now use ${'. '}dig.`);
        }

        if (item.effect === 'rob_protection') {
            const { addEffect } = await import('../../src/utils/economyDB.js');
            addEffect(eco, 'rob_protection', 24 * 60 * 60 * 1000);
            saveEco(sender, { inventory: inv, activeEffects: eco.activeEffects });
            return reply('🛡️ Shield activated! You\'re protected from robbery for 24h.');
        }

        // Temporary boost
        const { addEffect } = await import('../../src/utils/economyDB.js');
        addEffect(eco, item.effect, item.duration);
        saveEco(sender, { inventory: inv, activeEffects: eco.activeEffects });
        reply(`✅ ${item.name} activated! Effect: ${item.desc}\nDuration: ${Math.round(item.duration / 60000)} min`);
    },
};
