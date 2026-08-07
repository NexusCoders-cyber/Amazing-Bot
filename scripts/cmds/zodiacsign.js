export default {
    config: {
        name: 'zodiacsign',
        aliases: ['zodiac'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .zodiacsign <month> <day>nExample: .zodiacsign 7 21',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}zodiacsign <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .zodiacsign <month> <day>\nExample: .zodiacsign 7 21');
            const month = parseInt(args[0]);
            const day = parseInt(args[1]);
            if (isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
                return reply('Please provide a valid month (1-12) and day (1-31).');
            }
            const cutoffDay = [19, 18, 20, 19, 20, 20, 22, 22, 22, 22, 21, 21];
            const names = ['Capricorn', 'Aquarius', 'Pisces', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn'];
            const sign = day <= cutoffDay[month - 1] ? names[month - 1] : names[month];
            reply(`♈ Your zodiac sign is: *${sign}*`);
        
    },
};
