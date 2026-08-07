export default {
    config: {
        name: 'wordassociation',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .wordassociation <word>nI',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}wordassociation <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const associations = {
                sun: 'moon', hot: 'cold', black: 'white', up: 'down', fast: 'slow',
                happy: 'sad', big: 'small', day: 'night', king: 'queen', fire: 'water'
            };
            const word = (text || '').toLowerCase().trim();
            if (!word) return reply('Usage: .wordassociation <word>\nI\'ll give you the first thing that comes to mind!');
            const match = associations[word] || Object.entries(associations).find(([k, v]) => v === word)?.[0];
            reply(match ? `🔗 ${word} → *${match}*` : `🔗 ${word} → *mystery* (I don't have an association for that one yet)`);
        
    },
};
