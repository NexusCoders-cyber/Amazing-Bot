export default {
    config: {
        name: 'habitcheck',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .habitcheck <habit name>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}habitcheck <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .habitcheck <habit name>');
            const data = load(fs, fsx, 'habits.json');
            const habit = data[sender]?.[text];
            if (!habit) return reply(`No habit called "${text}". See your habits with .habitlist`);
            const today = todayStr();
            if (habit.lastCheck === today) return reply('Already checked off today! Come back tomorrow.');
            const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
            habit.streak = habit.lastCheck === yesterday ? habit.streak + 1 : 1;
            habit.lastCheck = today;
            habit.history.push(today);
            save(fs, 'habits.json', data);
            reply(`✅ "${text}" checked off! Current streak: *${habit.streak} day(s)* 🔥`);
        
    },
};
