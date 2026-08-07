export default {
    config: {
        name: 'sleepcalculator',
        aliases: ['bedtime'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .sleepcalculator <wake_time HH:mm>nExample: .sleepcalculator 07:00nCalc',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}sleepcalculator <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!args[0]) return reply('Usage: .sleepcalculator <wake_time HH:mm>\nExample: .sleepcalculator 07:00\nCalculates ideal bedtimes based on 90-minute sleep cycles.');
            const [h, mnt] = args[0].split(':').map(Number);
            if (isNaN(h) || isNaN(mnt)) return reply('Please use HH:mm format, e.g. 07:00');
            const wakeMinutes = h * 60 + mnt;
            const cycles = [6, 5, 4];
            const times = cycles.map(c => {
                let total = wakeMinutes - (c * 90) - 15; // 15 min to fall asleep
                total = ((total % 1440) + 1440) % 1440;
                const bh = Math.floor(total / 60);
                const bm = total % 60;
                return `${String(bh).padStart(2, '0')}:${String(bm).padStart(2, '0')} (${c} cycles, ${(c * 1.5)}h sleep)`;
            });
            reply(`😴 *Bedtime Options for waking at ${args[0]}*\n\n${times.join('\n')}`);
        
    },
};
