export default {
    config: {
        name: 'subscriptionlist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No subscriptions tracked. Add one with .subscriptiontrack <name> <cost>',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}subscriptionlist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'subscriptions.json');
            const subs = data[sender] || [];
            if (!subs.length) return reply('No subscriptions tracked. Add one with .subscriptiontrack <name> <cost>');
            const total = subs.reduce((s, x) => s + x.cost, 0);
            const out = subs.map(s => `${s.name}: $${s.cost}/mo`).join('\n');
            reply(`📺 *Your Subscriptions*\n\n${out}\n\nTotal: $${total.toFixed(2)}/month ($${(total * 12).toFixed(2)}/year)`);
        
    },
};
