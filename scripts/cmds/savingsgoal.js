export default {
    config: {
        name: 'savingsgoal',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .savingsgoal <target_amount> <monthly_saving>',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}savingsgoal <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .savingsgoal <target_amount> <monthly_saving>');
            const [target, monthly] = args.map(Number);
            if ([target, monthly].some(isNaN) || monthly <= 0) return reply('Please provide valid numbers.');
            const months = Math.ceil(target / monthly);
            const years = Math.floor(months / 12);
            const remMonths = months % 12;
            reply(`🎯 *Savings Goal*\n\nTarget: ${target}\nSaving: ${monthly}/month\n\nTime to reach goal: ${months} months (${years}y ${remMonths}m)`);
        
    },
};
