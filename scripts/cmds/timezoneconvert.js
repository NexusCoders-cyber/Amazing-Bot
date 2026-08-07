export default {
    config: {
        name: 'timezoneconvert',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .timezoneconvert <HH:mm> <offset_hours>nExample: .timezoneconvert 14:30 ',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}timezoneconvert <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .timezoneconvert <HH:mm> <offset_hours>\nExample: .timezoneconvert 14:30 +5\n(Converts from UTC to the given offset)');
            const [time, offsetStr] = args;
            const [h, m] = time.split(':').map(Number);
            if (isNaN(h) || isNaN(m)) return reply('Please provide time as HH:mm');
            const offset = parseFloat(offsetStr);
            let totalMinutes = h * 60 + m + offset * 60;
            totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
            const newH = Math.floor(totalMinutes / 60);
            const newM = Math.round(totalMinutes % 60);
            reply(`🕐 ${time} UTC → *${String(newH).padStart(2, '0')}:${String(newM).padStart(2, '0')}* at UTC${offset >= 0 ? '+' : ''}${offset}`);
        
    },
};
