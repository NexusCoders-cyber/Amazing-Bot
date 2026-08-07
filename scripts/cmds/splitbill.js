export default {
    config: {
        name: 'splitbill',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .splitbill <total_amount> <num_people> [tip%]',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}splitbill <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .splitbill <total_amount> <num_people> [tip%]');
            const [total, people, tipPct] = args.map(Number);
            if ([total, people].some(isNaN) || people <= 0) return reply('Please provide valid numbers.');
            const withTip = tipPct ? total * (1 + tipPct / 100) : total;
            reply(`🧾 *Split Bill*\n\nTotal: ${total}${tipPct ? ` (+${tipPct}% tip = ${withTip.toFixed(2)})` : ''}\nPeople: ${people}\n\nEach pays: ${(withTip / people).toFixed(2)}`);
        
    },
};
