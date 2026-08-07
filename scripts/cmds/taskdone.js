export default {
    config: {
        name: 'taskdone',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .taskdone <task number>nCheck numbers with .tasklist',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}taskdone <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const idx = parseInt(args[0]) - 1;
            const data = load(fs, fsx, 'tasks.json');
            const tasks = data[sender] || [];
            if (isNaN(idx) || !tasks[idx]) return reply('Usage: .taskdone <task number>\nCheck numbers with .tasklist');
            tasks[idx].done = true;
            save(fs, 'tasks.json', data);
            reply(`✅ Marked done: "${tasks[idx].text}"`);
        
    },
};
