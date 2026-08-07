export default {
    config: {
        name: 'taskdue',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .taskdue <task number> <YYYY-MM-DD>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}taskdue <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const idx = parseInt(args[0]) - 1;
            const due = args[1];
            if (!due || !/^\d{4}-\d{2}-\d{2}$/.test(due)) return reply('Usage: .taskdue <task number> <YYYY-MM-DD>');
            const data = load(fs, fsx, 'tasks.json');
            const tasks = data[sender] || [];
            if (isNaN(idx) || !tasks[idx]) return reply('Invalid task number. Check with .tasklist');
            tasks[idx].due = due;
            save(fs, 'tasks.json', data);
            reply(`📅 Due date for "${tasks[idx].text}" set to ${due}.`);
        
    },
};
