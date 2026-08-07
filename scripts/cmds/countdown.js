export default {
    config: {
        name: 'countdown',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .countdown YYYY-MM-DD',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}countdown <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const input = args[0];
            if (!input || !/^\d{4}-\d{2}-\d{2}$/.test(input)) return reply('Usage: .countdown YYYY-MM-DD');
            const target = new Date(input);
            if (isNaN(target.getTime())) return reply('Invalid date. Use format YYYY-MM-DD.');
            const diffMs = target.getTime() - Date.now();
            if (diffMs < 0) return reply('That date has already passed.');
            const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
            reply(`⏳ ${days} day(s) until ${input}`);
        
    },
};
