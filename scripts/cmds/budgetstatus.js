export default {
    config: {
        name: 'budgetstatus',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No budget set. Use .budgetset <amount> first.',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}budgetstatus <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const budgetData = load(fs, fsx, 'budget.json');
            const budget = budgetData[sender];
            if (!budget) return reply('No budget set. Use .budgetset <amount> first.');
            const expenseData = load(fs, fsx, 'expenses.json');
            const thisMonth = new Date().toISOString().slice(0, 7);
            const spent = (expenseData[sender] || []).filter(e => e.date.startsWith(thisMonth)).reduce((s, e) => s + e.amount, 0);
            const remaining = budget.amount - spent;
            const pct = Math.min(100, Math.round((spent / budget.amount) * 100));
            const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
            reply(`💰 *Budget Status (${thisMonth})*\n\n${bar} ${pct}%\nSpent: $${spent.toFixed(2)} / $${budget.amount.toFixed(2)}\nRemaining: $${remaining.toFixed(2)}${remaining < 0 ? ' ⚠️ Over budget!' : ''}`);
        
    },
};
