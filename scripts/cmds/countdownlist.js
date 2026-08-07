export default {
    config: {
        name: 'countdownlist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No countdowns saved. Add one with .countdownevent <YYYY-MM-DD> <name>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}countdownlist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'countdowns.json');
            const events = (data[sender] || []).slice();
            if (!events.length) return reply('No countdowns saved. Add one with .countdownevent <YYYY-MM-DD> <name>');
            events.sort((a, b) => new Date(a.date) - new Date(b.date));
            const now = new Date();
            const out = events.map(e => {
                const days = Math.ceil((new Date(e.date) - now) / 86400000);
                return `${e.name}: ${days >= 0 ? `${days}d away` : `${Math.abs(days)}d ago`} (${e.date})`;
            }).join('\n');
            reply(`⏳ *Your Countdowns*\n\n${out}`);
        
    },
};
