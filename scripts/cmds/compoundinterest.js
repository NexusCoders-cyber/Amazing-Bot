export default {
    config: {
        name: 'compoundinterest',
        aliases: ['compound'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .compoundinterest <principal> <annual_rate%> <years> [times_per_year=12]',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}compoundinterest <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 3) return reply('Usage: .compoundinterest <principal> <annual_rate%> <years> [times_per_year=12]');
            const [p, r, y, nPerYear] = args.map(Number);
            const n = nPerYear || 12;
            if ([p, r, y].some(isNaN)) return reply('Please provide valid numbers.');
            const amount = p * Math.pow(1 + (r / 100) / n, n * y);
            reply(`📈 *Compound Interest*\n\nPrincipal: ${p}\nRate: ${r}%\nTime: ${y} years\nCompounded ${n}x/year\n\nFinal amount: ${amount.toFixed(2)}\nInterest earned: ${(amount - p).toFixed(2)}`);
        
    },
};
