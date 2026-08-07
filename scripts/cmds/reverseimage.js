export default {
    config: {
        name: 'reverseimage',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🔍 Reverse image search needs an actual image lookup API — this bot does not cur',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}reverseimage <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            reply('🔍 Reverse image search needs an actual image lookup API — this bot does not currently have one configured. Recommend using Google Lens or TinEye directly for now.');
        
    },
};
