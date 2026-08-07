export default {
    config: {
        name: 'billlist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No bills tracked. Add one with .billreminder <name> <amount> <due_day>',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}billlist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'bills.json');
            const bills = data[sender] || [];
            if (!bills.length) return reply('No bills tracked. Add one with .billreminder <name> <amount> <due_day>');
            const now = new Date();
            const today = now.getDate();
            const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            const sorted = bills.slice().sort((a, b) => a.dueDay - b.dueDay);
            const out = sorted.map(b => {
                const daysUntil = b.dueDay >= today ? b.dueDay - today : (daysInMonth - today) + b.dueDay;
                return `${b.name}: $${b.amount} (day ${b.dueDay}, ~${daysUntil}d away)`;
            }).join('\n');
            const total = bills.reduce((s, b) => s + b.amount, 0);
            reply(`💳 *Your Bills*\n\n${out}\n\nTotal monthly: $${total.toFixed(2)}`);
        
    },
};
