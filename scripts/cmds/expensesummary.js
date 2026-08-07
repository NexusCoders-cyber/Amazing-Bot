export default {
    config: {
        name: 'expensesummary',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No expenses logged yet. Add one with .expenselog <amount> <description>',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}expensesummary <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'expenses.json');
            const expenses = data[sender] || [];
            if (!expenses.length) return reply('No expenses logged yet. Add one with .expenselog <amount> <description>');
            const period = (args[0] || 'all').toLowerCase();
            let filtered = expenses;
            if (period === 'today') filtered = expenses.filter(e => e.date === todayStr());
            if (period === 'week') {
                const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10);
                filtered = expenses.filter(e => e.date >= weekAgo);
            }
            const total = filtered.reduce((s, e) => s + e.amount, 0);
            reply(`💸 *Expense Summary (${period})*\n\nEntries: ${filtered.length}\nTotal spent: $${total.toFixed(2)}\n\nUsage: .expensesummary [today|week|all]`);
        
    },
};
