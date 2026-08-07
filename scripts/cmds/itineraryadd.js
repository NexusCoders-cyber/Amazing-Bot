export default {
    config: {
        name: 'itineraryadd',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .itineraryadd <day_number> <plan>nExample: .itineraryadd 1 Arrive at hot',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}itineraryadd <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .itineraryadd <day_number> <plan>\nExample: .itineraryadd 1 Arrive at hotel, explore old town');
            const day = parseInt(args[0]);
            if (isNaN(day)) return reply('First argument must be a day number, e.g. 1');
            const plan = args.slice(1).join(' ');
            const data = load(fs, fsx, 'itinerary.json');
            if (!data[sender]) data[sender] = {};
            if (!data[sender][day]) data[sender][day] = [];
            data[sender][day].push(plan);
            save(fs, 'itinerary.json', data);
            reply(`✈️ Added to Day ${day}: "${plan}"`);
        
    },
};
