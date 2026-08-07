export default {
    config: {
        name: 'tipcalc',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Calculate tip',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}tipcalc <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const bill = parseFloat(args[0]); const pct = parseFloat(args[1])||15; if(!bill) return reply('Usage: .tip <bill> [percent]'); const tip = bill*(pct/100); reply(`🧾 Tip: ${tip.toFixed(2)}
        💰 Total: ${(bill+tip).toFixed(2)}`);
    },
};
