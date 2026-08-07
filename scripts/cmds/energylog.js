export default {
    config: {
        name: 'energylog',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .energylog <1-10>nLogs your current energy level for the day.',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}energylog <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const level = parseInt(args[0]);
            if (!level || level < 1 || level > 10) return reply('Usage: .energylog <1-10>\nLogs your current energy level for the day.');
            const data = load(fs, fsx, 'energylog.json');
            if (!data[sender]) data[sender] = {};
            const today = todayStr();
            if (!data[sender][today]) data[sender][today] = [];
            data[sender][today].push({ level, time: new Date().toISOString() });
            save(fs, 'energylog.json', data);
            const todayLogs = data[sender][today];
            const avg = (todayLogs.reduce((s, l) => s + l.level, 0) / todayLogs.length).toFixed(1);
            reply(`⚡ Energy level logged: ${level}/10\nToday's average: ${avg}/10 (${todayLogs.length} check-ins)`);
        
    },
};
