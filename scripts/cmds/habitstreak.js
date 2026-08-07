export default {
    config: {
        name: 'habitstreak',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .habitstreak <habit name>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}habitstreak <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .habitstreak <habit name>');
            const data = load(fs, fsx, 'habits.json');
            const habit = data[sender]?.[text];
            if (!habit) return reply(`No habit called "${text}".`);
            reply(`🔥 "${text}" streak: *${habit.streak} day(s)*\nTotal check-ins: ${habit.history.length}`);
        
    },
};
