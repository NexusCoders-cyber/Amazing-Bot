export default {
    config: {
        name: 'taskadd',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .taskadd <task> [!priority: low/med/high] [@due: YYYY-MM-DD]nExample: .t',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}taskadd <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .taskadd <task> [!priority: low/med/high] [@due: YYYY-MM-DD]\nExample: .taskadd Finish report !high @2026-07-10');
            const data = load(fs, fsx, 'tasks.json');
            if (!data[sender]) data[sender] = [];
            const priorityMatch = text.match(/!(\w+)/);
            const dueMatch = text.match(/@(\d{4}-\d{2}-\d{2})/);
            const clean = text.replace(/!\w+/, '').replace(/@\d{4}-\d{2}-\d{2}/, '').trim();
            const task = {
                text: clean,
                priority: priorityMatch ? priorityMatch[1].toLowerCase() : 'normal',
                due: dueMatch ? dueMatch[1] : null,
                done: false,
                created: Date.now()
            };
            data[sender].push(task);
            save(fs, 'tasks.json', data);
            reply(`✅ Task added: "${clean}"${task.priority !== 'normal' ? ` [${task.priority}]` : ''}${task.due ? ` (due ${task.due})` : ''}`);
        
    },
};
