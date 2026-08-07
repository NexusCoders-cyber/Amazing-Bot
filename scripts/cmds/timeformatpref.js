export default {
    config: {
        name: 'timeformatpref',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Your time format preference: *${current}*nUsage: .timeformatpref 12 | .timeform',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}timeformatpref <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'preferences.json');
            const choice = args[0];
            if (!choice) {
                const current = data[sender]?.timeFormat || 'not set';
                return reply(`Your time format preference: *${current}*\nUsage: .timeformatpref 12 | .timeformatpref 24`);
            }
            if (!['12', '24'].includes(choice)) return reply('Usage: .timeformatpref 12 | .timeformatpref 24');
            if (!data[sender]) data[sender] = {};
            data[sender].timeFormat = choice + 'h';
            save(fs, 'preferences.json', data);
            reply(`✅ Time format set to *${choice}h*.`);
        
    },
};
