export default {
    config: {
        name: 'goallist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No goals set. Add one with .goaladd <target> <goal name>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}goallist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'goals.json');
            const goals = data[sender] || [];
            if (!goals.length) return reply('No goals set. Add one with .goaladd <target> <goal name>');
            const out = goals.map((g, i) => {
                const pct = Math.min(100, Math.round((g.progress / g.target) * 100));
                const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
                return `${i + 1}. ${g.name}\n   ${bar} ${g.progress}/${g.target} (${pct}%)${g.done ? ' ✅' : ''}`;
            }).join('\n');
            reply(`🎯 *Your Goals*\n\n${out}`);
        
    },
};
