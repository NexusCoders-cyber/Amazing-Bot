export default {
    config: {
        name: 'itinerarylist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No itinerary yet. Add one with .itineraryadd <day> <plan>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}itinerarylist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'itinerary.json');
            const days = data[sender] || {};
            const dayNums = Object.keys(days).sort((a, b) => a - b);
            if (!dayNums.length) return reply('No itinerary yet. Add one with .itineraryadd <day> <plan>');
            const out = dayNums.map(d => `*Day ${d}*\n${days[d].map(p => `  • ${p}`).join('\n')}`).join('\n\n');
            reply(`✈️ *Your Itinerary*\n\n${out}`);
        
    },
};
