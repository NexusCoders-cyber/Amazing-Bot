export default {
    config: {
        name: 'tasklist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🎉 No pending tasks! Add one with .taskadd <task>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}tasklist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'tasks.json');
            const tasks = data[sender] || [];
            const pending = tasks.map((t, i) => ({ ...t, idx: i })).filter(t => !t.done);
            if (!pending.length) return reply('🎉 No pending tasks! Add one with .taskadd <task>');
            const order = { high: 0, med: 1, normal: 2, low: 3 };
            pending.sort((a, b) => (order[a.priority] ?? 2) - (order[b.priority] ?? 2));
            const out = pending.map(t => `${t.idx + 1}. ${t.text}${t.priority !== 'normal' ? ` [${t.priority}]` : ''}${t.due ? ` (due ${t.due})` : ''}`).join('\n');
            reply(`📋 *Your Tasks*\n\n${out}\n\nMark done with .taskdone <number>`);
        
    },
};
