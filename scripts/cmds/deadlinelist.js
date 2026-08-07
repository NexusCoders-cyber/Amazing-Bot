export default {
    config: {
        name: 'deadlinelist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No deadlines set. Add one with .deadlineadd <YYYY-MM-DD> <description>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}deadlinelist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'deadlines.json');
            const items = (data[sender] || []).slice();
            if (!items.length) return reply('No deadlines set. Add one with .deadlineadd <YYYY-MM-DD> <description>');
            const now = new Date();
            items.sort((a, b) => new Date(a.date) - new Date(b.date));
            const out = items.map(d => {
                const days = Math.ceil((new Date(d.date) - now) / 86400000);
                const status = days < 0 ? '⚠️ overdue' : days === 0 ? '🔥 today' : `${days}d left`;
                return `${d.date} — ${d.desc} (${status})`;
            }).join('\n');
            reply(`⏳ *Deadlines*\n\n${out}`);
        
    },
};
