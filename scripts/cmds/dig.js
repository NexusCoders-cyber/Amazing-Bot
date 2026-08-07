import { getEco, saveEco, fmtCoins, addXp, hasEffect } from '../../src/utils/economyDB.js';

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

const TREASURES = [
    { name: 'Gold coin', min: 100, max: 500, emoji: '🪙' },
    { name: 'Silver ring', min: 200, max: 800, emoji: '💍' },
    { name: 'Old bottle', min: 50, max: 200, emoji: '🍶' },
    { name: 'Gemstone', min: 500, max: 2000, emoji: '💎' },
    { name: 'Ancient coin', min: 300, max: 1000, emoji: '🪙' },
    { name: 'Nothing but dirt', min: 0, max: 0, emoji: '💩' },
    { name: 'Broken pottery', min: 10, max: 50, emoji: '🏺' },
    { name: 'Golden chalice', min: 1000, max: 3000, emoji: '🏆' },
];

export default {
    config: {
        name: 'dig',
        aliases: ['excavate', 'digging'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Dig for treasures',
        category: 'economy',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}dig (requires shovel from shop)' },
    },
    async onStart({ sender, reply }) {
        const eco = getEco(sender);
        const badges = eco.badges || [];

        // Check for shovel
        if (!badges.includes('digger')) {
            const inv = eco.inventory || [];
            const hasShovel = inv.includes('shovel');
            if (!hasShovel) return reply('You need a shovel to dig! Buy one from the shop.');
            // Auto-activate
            inv.splice(inv.indexOf('shovel'), 1);
            badges.push('digger');
            saveEco(sender, { inventory: inv, badges });
        }

        const hasTreasureMap = hasEffect(eco, 'treasuremap') || (eco.inventory || []).includes('treasuremap');
        const roll = Math.random();
        const treasureIdx = hasTreasureMap ? rand(3, TREASURES.length - 1) : rand(0, TREASURES.length - 1);
        const treasure = TREASURES[treasureIdx];
        const value = rand(treasure.min, treasure.max);

        const { xp, level } = addXp(eco, 30);

        if (value > 0) {
            saveEco(sender, { wallet: (eco.wallet || 0) + value, xp, level });
            reply([
                `⛏️ *DIGGING...*`,
                '',
                `${treasure.emoji} Found: ${treasure.name}!`,
                `Value: ${fmtCoins(value)}`,
                `Wallet: ${fmtCoins((eco.wallet || 0) + value)}`,
            ].join('\n'));
        } else {
            saveEco(sender, { xp, level });
            reply(`⛏️ *DIGGING...*\n\n${treasure.emoji} ${treasure.name}. Better luck next time!`);
        }
    },
};
