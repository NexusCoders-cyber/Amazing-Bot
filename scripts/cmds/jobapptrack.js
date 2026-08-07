export default {
    config: {
        name: 'jobapptrack',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No job applications tracked. Add one with .jobapptrack <company> <role> <status>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}jobapptrack <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'jobapps.json');
            if (!args.length) {
                const apps = data[sender] || [];
                if (!apps.length) return reply('No job applications tracked. Add one with .jobapptrack <company> <role> <status>\nExample: .jobapptrack Acme "Software Engineer" applied');
                return reply(`💼 *Job Applications*\n\n${apps.map((a, i) => `${i + 1}. ${a.company} — ${a.role} (${a.status})`).join('\n')}`);
            }
            if (args.length < 3) return reply('Usage: .jobapptrack <company> <role> <status>\nStatuses: applied, interview, offer, rejected');
            const status = args[args.length - 1].toLowerCase();
            const company = args[0];
            const role = args.slice(1, -1).join(' ');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ company, role, status });
            save(fs, 'jobapps.json', data);
            reply(`💼 Tracked: ${company} — ${role} (${status})`);
        
    },
};
