export default {
    config: {
        name: 'loancalc',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .loancalc <principal> <annual_rate%> <years>nExample: .loancalc 10000 5 ',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}loancalc <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 3) return reply('Usage: .loancalc <principal> <annual_rate%> <years>\nExample: .loancalc 10000 5 3');
            const [p, r, y] = args.map(Number);
            if ([p, r, y].some(isNaN) || p <= 0 || y <= 0) return reply('Please provide valid positive numbers.');
            const monthlyRate = (r / 100) / 12;
            const n = y * 12;
            const payment = monthlyRate === 0 ? p / n : (p * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));
            const total = payment * n;
            reply(`💰 *Loan Calculator*\n\nPrincipal: ${p}\nRate: ${r}% / year\nTerm: ${y} years\n\nMonthly payment: ${payment.toFixed(2)}\nTotal repayment: ${total.toFixed(2)}\nTotal interest: ${(total - p).toFixed(2)}`);
        
    },
};
