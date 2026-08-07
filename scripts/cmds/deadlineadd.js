export default {
    config: {
        name: 'deadlineadd',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .deadlineadd <YYYY-MM-DD> <description>nExample: .deadlineadd 2026-08-01',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}deadlineadd <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .deadlineadd <YYYY-MM-DD> <description>\nExample: .deadlineadd 2026-08-01 Submit tax return');
            const date = args[0];
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return reply('Date must be in YYYY-MM-DD format.');
            const desc = args.slice(1).join(' ');
            const data = load(fs, fsx, 'deadlines.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ date, desc });
            save(fs, 'deadlines.json', data);
            reply(`⏳ Deadline added: "${desc}" on ${date}`);
        
    },
};
