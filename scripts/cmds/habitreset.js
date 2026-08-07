export default {
    config: {
        name: 'habitreset',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .habitreset <habit name>nRemoves the habit and its history entirely.',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}habitreset <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .habitreset <habit name>\nRemoves the habit and its history entirely.');
            const data = load(fs, fsx, 'habits.json');
            if (!data[sender]?.[text]) return reply(`No habit called "${text}".`);
            delete data[sender][text];
            save(fs, 'habits.json', data);
            reply(`🗑️ Habit "${text}" removed.`);
        
    },
};
