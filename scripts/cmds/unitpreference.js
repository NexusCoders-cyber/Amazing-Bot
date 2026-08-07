export default {
    config: {
        name: 'unitpreference',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Your unit preference: *${current}*nUsage: .unitpreference metric | .unitprefere',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}unitpreference <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'preferences.json');
            const choice = (args[0] || '').toLowerCase();
            if (!choice) {
                const current = data[sender]?.units || 'not set';
                return reply(`Your unit preference: *${current}*\nUsage: .unitpreference metric | .unitpreference imperial`);
            }
            if (!['metric', 'imperial'].includes(choice)) return reply('Usage: .unitpreference metric | .unitpreference imperial');
            if (!data[sender]) data[sender] = {};
            data[sender].units = choice;
            save(fs, 'preferences.json', data);
            reply(`✅ Unit preference set to *${choice}*.`);
        
    },
};
