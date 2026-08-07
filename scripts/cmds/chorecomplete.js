export default {
    config: {
        name: 'chorecomplete',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .chorecomplete <chore number>',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}chorecomplete <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const key = isGroup ? from : sender;
            const idx = parseInt(args[0]) - 1;
            const data = load(fs, fsx, 'chores.json');
            const chores = data[key] || [];
            if (isNaN(idx) || !chores[idx]) return reply('Usage: .chorecomplete <chore number>');
            chores[idx].done = true;
            save(fs, 'chores.json', data);
            reply(`✅ Chore done: "${chores[idx].text}"`);
        
    },
};
