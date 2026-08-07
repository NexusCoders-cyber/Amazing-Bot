export default {
    config: {
        name: 'habitadd',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .habitadd <habit name>nExample: .habitadd Drink 2L water',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}habitadd <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .habitadd <habit name>\nExample: .habitadd Drink 2L water');
            const data = load(fs, fsx, 'habits.json');
            if (!data[sender]) data[sender] = {};
            if (data[sender][text]) return reply('You already have that habit tracked.');
            data[sender][text] = { streak: 0, lastCheck: null, history: [] };
            save(fs, 'habits.json', data);
            reply(`✅ Habit added: "${text}"\nCheck it off daily with .habitcheck ${text}`);
        
    },
};
