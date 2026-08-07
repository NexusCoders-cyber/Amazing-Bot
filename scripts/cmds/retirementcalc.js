export default {
    config: {
        name: 'retirementcalc',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .retirementcalc <current_savings> <monthly_contribution> <years> <annual_',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}retirementcalc <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 4) return reply('Usage: .retirementcalc <current_savings> <monthly_contribution> <years> <annual_return%>');
            const [current, monthly, years, ret] = args.map(Number);
            if ([current, monthly, years, ret].some(isNaN)) return reply('Please provide valid numbers.');
            const monthlyRate = (ret / 100) / 12;
            const months = years * 12;
            let total = current;
            for (let i = 0; i < months; i++) total = total * (1 + monthlyRate) + monthly;
            reply(`🏖️ *Retirement Projection*\n\nStarting: ${current}\nMonthly contribution: ${monthly}\nYears: ${years}\nAnnual return: ${ret}%\n\nEstimated total: ${total.toFixed(2)}`);
        
    },
};
