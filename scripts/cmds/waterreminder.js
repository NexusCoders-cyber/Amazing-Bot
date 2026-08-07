export default {
    config: {
        name: 'waterreminder',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Water reminders turned off.',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}waterreminder <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const sub = (args[0] || '').toLowerCase();
            const data = load(fs, fsx, 'waterreminder.json');
            if (sub === 'off') {
                data[sender] = { active: false };
                save(fs, 'waterreminder.json', data);
                return reply('Water reminders turned off.');
            }
            const intervalMin = parseInt(args[0]) || 60;
            data[sender] = { active: true, interval: intervalMin };
            save(fs, 'waterreminder.json', data);
            reply(`💧 I'll remind you to drink water every ${intervalMin} minutes for the next few hours.`);
            let count = 0;
            const maxReminders = Math.min(8, Math.floor(480 / intervalMin));
            const iv = setInterval(() => {
                count++;
                const current = load(fs, fsx, 'waterreminder.json');
                if (!current[sender]?.active || count > maxReminders) return clearInterval(iv);
                King.sendMessage(from, { text: '💧 Time to drink some water!' }, { quoted: m }).catch(() => {});
            }, intervalMin * 60000);
        
    },
};
