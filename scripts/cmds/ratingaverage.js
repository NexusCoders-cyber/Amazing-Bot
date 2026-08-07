export default {
    config: {
        name: 'ratingaverage',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .ratingaverage <rating1,rating2,rating3...>nExample: .ratingaverage 4,5,',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}ratingaverage <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .ratingaverage <rating1,rating2,rating3...>\nExample: .ratingaverage 4,5,3,4.5');
            const ratings = text.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
            if (!ratings.length) return reply('Please provide comma-separated numbers.');
            const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length;
            reply(`⭐ Average rating: *${avg.toFixed(2)}* (from ${ratings.length} ratings)`);
        
    },
};
