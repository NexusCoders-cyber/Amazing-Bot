export default {
    config: {
        name: 'worldtimeadd',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .worldtimeadd <city> <utc_offset>nExample: .worldtimeadd Tokyo +9',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}worldtimeadd <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .worldtimeadd <city> <utc_offset>\nExample: .worldtimeadd Tokyo +9');
            const offset = parseFloat(args[args.length - 1]);
            const city = args.slice(0, -1).join(' ');
            if (isNaN(offset)) return reply('Offset must be a number, e.g. +9 or -5');
            const data = load(fs, fsx, 'worldtimes.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ city, offset });
            save(fs, 'worldtimes.json', data);
            reply(`🌍 Saved ${city} at UTC${offset >= 0 ? '+' : ''}${offset}`);
        
    },
};
