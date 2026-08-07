export default {
    config: {
        name: 'countdownevent',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .countdownevent <YYYY-MM-DD> <event name>nExample: .countdownevent 2026-',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}countdownevent <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .countdownevent <YYYY-MM-DD> <event name>\nExample: .countdownevent 2026-12-25 Christmas');
            const date = args[0];
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return reply('Date must be in YYYY-MM-DD format.');
            const name = args.slice(1).join(' ');
            const data = load(fs, fsx, 'countdowns.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ date, name });
            save(fs, 'countdowns.json', data);
            const days = Math.ceil((new Date(date) - new Date()) / 86400000);
            reply(`⏳ Countdown saved: "${name}" on ${date} (${days} days away)`);
        
    },
};
