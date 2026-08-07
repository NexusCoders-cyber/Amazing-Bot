export default {
    config: {
        name: 'taskpriority',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .taskpriority <task number> <low|med|high|normal>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}taskpriority <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const idx = parseInt(args[0]) - 1;
            const priority = (args[1] || '').toLowerCase();
            if (!['low', 'med', 'high', 'normal'].includes(priority)) return reply('Usage: .taskpriority <task number> <low|med|high|normal>');
            const data = load(fs, fsx, 'tasks.json');
            const tasks = data[sender] || [];
            if (isNaN(idx) || !tasks[idx]) return reply('Invalid task number. Check with .tasklist');
            tasks[idx].priority = priority;
            save(fs, 'tasks.json', data);
            reply(`🔧 Task "${tasks[idx].text}" priority set to ${priority}.`);
        
    },
};
