export default {
    config: {
        name: 'taxcalc',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .taxcalc <income> <tax_rate%>',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}taxcalc <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .taxcalc <income> <tax_rate%>');
            const [income, rate] = args.map(Number);
            if ([income, rate].some(isNaN)) return reply('Please provide valid numbers.');
            const tax = income * (rate / 100);
            reply(`🧮 *Tax Calculator*\n\nIncome: ${income}\nRate: ${rate}%\n\nTax owed: ${tax.toFixed(2)}\nNet income: ${(income - tax).toFixed(2)}`);
        
    },
};
