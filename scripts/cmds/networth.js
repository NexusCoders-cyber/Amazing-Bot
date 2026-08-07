export default {
    config: {
        name: 'networth',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .networth <total_assets> <total_liabilities>',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}networth <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .networth <total_assets> <total_liabilities>');
            const [assets, liabilities] = args.map(Number);
            if ([assets, liabilities].some(isNaN)) return reply('Please provide valid numbers.');
            reply(`📊 *Net Worth*\n\nAssets: ${assets}\nLiabilities: ${liabilities}\n\nNet worth: ${(assets - liabilities).toFixed(2)}`);
        
    },
};
