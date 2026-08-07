export default {
    config: {
        name: 'backpack',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Economy system unavailable right now.',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}backpack <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!getEconomy) return reply('Economy system unavailable right now.');
            let data = getEconomy(sender);
            ensureInventory(data);
            const inv = data.inventory;
            reply(`🎒 *Your Backpack*\n\n🐟 Fish: ${inv.fish}\n🪵 Wood: ${inv.wood}\n⛏️ Ore: ${inv.ore}\n🌾 Crop: ${inv.crop}\n💰 Coins: ${data.coins || 0}\n\nGather more with .fish .hunt .mine2 .chop .farm\nTurn resources into coins with .trade or .craft`);
        
    },
};
