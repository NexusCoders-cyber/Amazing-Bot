export default {
    config: {
        name: 'daysbetween',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .daysbetween YYYY-MM-DD YYYY-MM-DD',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}daysbetween <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const [d1, d2] = args;
            if (!d1 || !d2 || !/^\d{4}-\d{2}-\d{2}$/.test(d1) || !/^\d{4}-\d{2}-\d{2}$/.test(d2)) {
                return reply('Usage: .daysbetween YYYY-MM-DD YYYY-MM-DD');
            }
            const a = new Date(d1), b = new Date(d2);
            if (isNaN(a.getTime()) || isNaN(b.getTime())) return reply('Invalid date(s).');
            const days = Math.abs(Math.round((b - a) / (1000 * 60 * 60 * 24)));
            reply(`📆 ${days} day(s) between ${d1} and ${d2}`);
        
    },
};
