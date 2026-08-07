export default {
    config: {
        name: 'goalcomplete',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .goalcomplete <goal number>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}goalcomplete <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const idx = parseInt(args[0]) - 1;
            const data = load(fs, fsx, 'goals.json');
            const goals = data[sender] || [];
            if (isNaN(idx) || !goals[idx]) return reply('Usage: .goalcomplete <goal number>');
            goals[idx].done = true;
            goals[idx].progress = goals[idx].target;
            save(fs, 'goals.json', data);
            reply(`🎉 Goal "${goals[idx].name}" marked complete!`);
        
    },
};
