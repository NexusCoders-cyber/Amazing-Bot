export default {
    config: {
        name: 'choreadd',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .choreadd <chore>nExample: .choreadd Take out the trash',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}choreadd <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .choreadd <chore>\nExample: .choreadd Take out the trash');
            const key = isGroup ? from : sender;
            const data = load(fs, fsx, 'chores.json');
            if (!data[key]) data[key] = [];
            data[key].push({ text, done: false, assignedTo: null });
            save(fs, 'chores.json', data);
            reply(`🧹 Chore added: "${text}"`);
        
    },
};
