export default {
    config: {
        name: 'coinweighted',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .coinweighted <percent chance of heads>nExample: .coinweighted 70',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}coinweighted <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const pct = parseInt(args[0]);
            if (isNaN(pct) || pct < 1 || pct > 99) return reply('Usage: .coinweighted <percent chance of heads>\nExample: .coinweighted 70');
            const result = Math.random() * 100 < pct ? 'Heads' : 'Tails';
            reply(`🪙 Weighted coin (${pct}% heads): *${result}*`);
        
    },
};
