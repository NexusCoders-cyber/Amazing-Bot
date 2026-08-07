export default {
    config: {
        name: 'tip',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .tip <bill amount> [tip% default 15] [split between people]',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}tip <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const bill = parseFloat(args[0]);
            const percent = parseFloat(args[1]) || 15;
            const people = parseInt(args[2]) || 1;
            if (!bill) return reply('Usage: .tip <bill amount> [tip% default 15] [split between people]');
            const tipAmount = bill * (percent / 100);
            const total = bill + tipAmount;
            reply(`🧾 Bill: ${bill.toFixed(2)}\nTip (${percent}%): ${tipAmount.toFixed(2)}\nTotal: ${total.toFixed(2)}\nPer person (${people}): ${(total / people).toFixed(2)}`);
        
    },
};
