export default {
    config: {
        name: 'habitlist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No habits tracked yet. Add one with .habitadd <habit name>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}habitlist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'habits.json');
            const habits = data[sender] || {};
            const names = Object.keys(habits);
            if (!names.length) return reply('No habits tracked yet. Add one with .habitadd <habit name>');
            const out = names.map(n => `• ${n} — streak: ${habits[n].streak}${habits[n].lastCheck === todayStr() ? ' ✅ today' : ''}`).join('\n');
            reply(`📊 *Your Habits*\n\n${out}`);
        
    },
};
