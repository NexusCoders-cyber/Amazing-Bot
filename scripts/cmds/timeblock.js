export default {
    config: {
        name: 'timeblock',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .timeblock <start HH:mm> <end HH:mm> <activity>nExample: .timeblock 09:0',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}timeblock <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 3) return reply('Usage: .timeblock <start HH:mm> <end HH:mm> <activity>\nExample: .timeblock 09:00 10:30 Deep work on report');
            const [start, end] = args;
            const activity = args.slice(2).join(' ');
            const toMin = t => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
            const duration = toMin(end) - toMin(start);
            if (isNaN(duration) || duration <= 0) return reply('End time must be after start time, both in HH:mm format.');
            reply(`🗓️ *Time Block*\n\n${start} - ${end} (${duration} min)\n${activity}`);
        
    },
};
