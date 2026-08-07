export default {
    config: {
        name: 'goalprogress',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .goalprogress <goal number> [amount]nCheck numbers with .goallist',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}goalprogress <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const idx = parseInt(args[0]) - 1;
            const amount = parseInt(args[1]) || 1;
            const data = load(fs, fsx, 'goals.json');
            const goals = data[sender] || [];
            if (isNaN(idx) || !goals[idx]) return reply('Usage: .goalprogress <goal number> [amount]\nCheck numbers with .goallist');
            goals[idx].progress += amount;
            if (goals[idx].progress >= goals[idx].target) goals[idx].done = true;
            save(fs, 'goals.json', data);
            const g = goals[idx];
            reply(`📈 "${g.name}": ${g.progress}/${g.target}${g.done ? ' 🎉 GOAL COMPLETE!' : ''}`);
        
    },
};
