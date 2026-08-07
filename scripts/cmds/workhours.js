export default {
    config: {
        name: 'workhours',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .workhours <hours_worked> <hourly_rate> [overtime_hours]nExample: .workh',
        category: 'economy',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}workhours <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .workhours <hours_worked> <hourly_rate> [overtime_hours]\nExample: .workhours 40 20 5');
            const hours = parseFloat(args[0]);
            const rate = parseFloat(args[1]);
            const overtime = parseFloat(args[2]) || 0;
            if (isNaN(hours) || isNaN(rate)) return reply('Please provide valid numbers.');
            const regularPay = hours * rate;
            const overtimePay = overtime * rate * 1.5;
            const total = regularPay + overtimePay;
            reply(`💵 *Pay Calculation*\n\nRegular: ${hours}h × $${rate} = $${regularPay.toFixed(2)}${overtime ? `\nOvertime: ${overtime}h × $${(rate * 1.5).toFixed(2)} = $${overtimePay.toFixed(2)}` : ''}\n\nTotal: *$${total.toFixed(2)}*`);
        
    },
};
