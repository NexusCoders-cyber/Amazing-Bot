export default {
    config: {
        name: 'subscriptiontrack',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .subscriptiontrack <name> <monthly_cost>nExample: .subscriptiontrack Net',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}subscriptiontrack <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .subscriptiontrack <name> <monthly_cost>\nExample: .subscriptiontrack Netflix 15.99');
            const cost = parseFloat(args[args.length - 1]);
            const name = args.slice(0, -1).join(' ');
            if (isNaN(cost)) return reply('Please provide a valid cost.');
            const data = load(fs, fsx, 'subscriptions.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ name, cost });
            save(fs, 'subscriptions.json', data);
            reply(`📺 Subscription tracked: "${name}" — $${cost}/month`);
        
    },
};
