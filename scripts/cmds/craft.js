export default {
    config: {
        name: 'craft',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Economy system unavailable right now.',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}craft <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!getEconomy) return reply('Economy system unavailable right now.');
            let data = getEconomy(sender);
            ensureInventory(data);
            const item = (args[0] || '').toLowerCase();
            const recipes = {
                tool: { wood: 3, ore: 2, coinValue: 50 },
                boat: { wood: 8, fish: 2, coinValue: 100 },
                ring: { ore: 5, coinValue: 150 }
            };
            if (!item || !recipes[item]) {
                return reply(`Usage: .craft <item>\nAvailable: ${Object.keys(recipes).join(', ')}\nRecipes:\n${Object.entries(recipes).map(([k, v]) => `${k}: ${Object.entries(v).filter(([kk]) => kk !== 'coinValue').map(([kk, vv]) => `${vv} ${kk}`).join(', ')}`).join('\n')}`);
            }
            const recipe = recipes[item];
            for (const [res, need] of Object.entries(recipe)) {
                if (res === 'coinValue') continue;
                if ((data.inventory[res] || 0) < need) return reply(`You need ${need} ${res} to craft a ${item}. You have ${data.inventory[res] || 0}.`);
            }
            for (const [res, need] of Object.entries(recipe)) {
                if (res === 'coinValue') continue;
                data.inventory[res] -= need;
            }
            data.coins = (data.coins || 0) + recipe.coinValue;
            saveEconomy(sender, data);
            reply(`🛠️ Crafted a *${item}*! Sold it for *${recipe.coinValue} coins*.`);
        
    },
};
