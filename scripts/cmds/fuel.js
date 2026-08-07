export default {
    config: {
        name: 'fuel',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Fuel cost calculator',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}fuel <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const [km,lpg] = args.map(Number); if(!km||!lpg) return reply('Usage: .fuel <km> <price_per_liter>'); const cost = (km/15)*lpg; reply(`⛽ Est. fuel cost: *${cost.toFixed(2)}*
        (based on 15km/L)`);
    },
};
