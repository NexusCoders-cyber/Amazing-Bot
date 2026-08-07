export default {
    config: {
        name: 'budgetset',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .budgetset <monthly_amount>nExample: .budgetset 1000',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}budgetset <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const amount = parseFloat(args[0]);
            if (isNaN(amount) || amount <= 0) return reply('Usage: .budgetset <monthly_amount>\nExample: .budgetset 1000');
            const data = load(fs, fsx, 'budget.json');
            data[sender] = { amount, month: new Date().toISOString().slice(0, 7) };
            save(fs, 'budget.json', data);
            reply(`💰 Monthly budget set to $${amount.toFixed(2)}.`);
        
    },
};
