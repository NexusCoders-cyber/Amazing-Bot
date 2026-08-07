export default {
    config: {
        name: 'cronparse',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .cronparse <cron expression>nExample: .cronparse 0 9 * * 1-5',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}cronparse <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .cronparse <cron expression>\nExample: .cronparse 0 9 * * 1-5');
            const parts = text.trim().split(/\s+/);
            if (parts.length !== 5) return reply('A standard cron expression needs 5 fields: minute hour day month weekday.');
            const [min, hour, day, month, weekday] = parts;
            reply(`⏰ *Cron Breakdown*\n\nMinute: ${min}\nHour: ${hour}\nDay of month: ${day}\nMonth: ${month}\nDay of week: ${weekday}\n\nRuns at minute ${min} of hour ${hour}, on day ${day} of month ${month}, weekday(s) ${weekday}.`);
        
    },
};
