export default {
    config: {
        name: 'timezonelist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No cities saved. Add one with .worldtimeadd <city> <utc_offset>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}timezonelist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'worldtimes.json');
            const cities = data[sender] || [];
            if (!cities.length) return reply('No cities saved. Add one with .worldtimeadd <city> <utc_offset>');
            const now = new Date();
            const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
            const out = cities.map(c => {
                let total = ((utcMinutes + c.offset * 60) % 1440 + 1440) % 1440;
                const h = Math.floor(total / 60);
                const mnt = Math.round(total % 60);
                return `${c.city} (UTC${c.offset >= 0 ? '+' : ''}${c.offset}): ${String(h).padStart(2, '0')}:${String(mnt).padStart(2, '0')}`;
            }).join('\n');
            reply(`🌍 *World Clock*\n\n${out}`);
        
    },
};
