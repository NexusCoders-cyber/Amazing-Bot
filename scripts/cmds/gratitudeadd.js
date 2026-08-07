export default {
    config: {
        name: 'gratitudeadd',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .gratitudeadd <something you',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}gratitudeadd <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .gratitudeadd <something you\'re grateful for>');
            const data = load(fs, fsx, 'gratitude.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ text, date: todayStr() });
            save(fs, 'gratitude.json', data);
            reply(`🙏 Added: "${text}"`);
        
    },
};
