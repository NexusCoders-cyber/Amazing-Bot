export default {
    config: {
        name: 'billreminder',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .billreminder <name> <amount> <due_day 1-31>nExample: .billreminder Rent',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}billreminder <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 3) return reply('Usage: .billreminder <name> <amount> <due_day 1-31>\nExample: .billreminder Rent 800 1');
            const dueDay = parseInt(args[args.length - 1]);
            const amount = parseFloat(args[args.length - 2]);
            const name = args.slice(0, -2).join(' ');
            if (isNaN(dueDay) || dueDay < 1 || dueDay > 31 || isNaN(amount)) return reply('Usage: .billreminder <name> <amount> <due_day 1-31>');
            const data = load(fs, fsx, 'bills.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ name, amount, dueDay });
            save(fs, 'bills.json', data);
            reply(`💳 Bill added: "${name}" — $${amount} due on day ${dueDay} of each month.`);
        
    },
};
