export default {
    config: {
        name: 'percentage',
        aliases: ['percent'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .percentage <part> <whole>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}percentage <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const part = parseFloat(args[0]);
            const whole = parseFloat(args[1]);
            if (isNaN(part) || isNaN(whole) || whole === 0) return reply('Usage: .percentage <part> <whole>');
            reply(`📊 ${part} is ${((part / whole) * 100).toFixed(2)}% of ${whole}`);
        
    },
};
