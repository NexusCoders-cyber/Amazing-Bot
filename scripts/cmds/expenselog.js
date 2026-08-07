export default {
    config: {
        name: 'expenselog',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .expenselog <amount> <description>nExample: .expenselog 25.50 Lunch with',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}expenselog <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .expenselog <amount> <description>\nExample: .expenselog 25.50 Lunch with friends');
            const amount = parseFloat(args[0]);
            if (isNaN(amount)) return reply('First argument must be a valid amount.');
            const desc = args.slice(1).join(' ');
            const data = load(fs, fsx, 'expenses.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ amount, desc, date: todayStr() });
            save(fs, 'expenses.json', data);
            reply(`💸 Logged: $${amount.toFixed(2)} — ${desc}`);
        
    },
};
