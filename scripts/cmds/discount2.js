export default {
    config: {
        name: 'discount2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Calculate discount',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}discount2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const [price,pct] = args.map(Number); if(isNaN(price)||isNaN(pct)) return reply('Usage: .discount <price> <percent>'); const final = price*(1-pct/100); reply(`🏷️ Original: ${price.toFixed(2)}
        💸 Save: ${pct}%
        💰 Final: ${final.toFixed(2)}`);
    },
};
