export default {
    config: {
        name: 'discount',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .discount <price> <percent off>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}discount <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const price = parseFloat(args[0]);
            const percent = parseFloat(args[1]);
            if (!price || isNaN(percent)) return reply('Usage: .discount <price> <percent off>');
            const discounted = price - (price * (percent / 100));
            reply(`🏷️ Original: ${price.toFixed(2)}\nDiscount: ${percent}%\nFinal price: ${discounted.toFixed(2)}`);
        
    },
};
