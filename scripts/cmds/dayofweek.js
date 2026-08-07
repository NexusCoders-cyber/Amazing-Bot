export default {
    config: {
        name: 'dayofweek',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .dayofweek YYYY-MM-DD',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}dayofweek <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const input = args[0];
            if (!input || !/^\d{4}-\d{2}-\d{2}$/.test(input)) return reply('Usage: .dayofweek YYYY-MM-DD');
            const date = new Date(input);
            if (isNaN(date.getTime())) return reply('Invalid date. Use format YYYY-MM-DD.');
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            reply(`📅 ${input} was/is a ${days[date.getUTCDay()]}`);
        
    },
};
