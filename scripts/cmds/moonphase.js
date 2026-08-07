export default {
    config: {
        name: 'moonphase',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🌙 Today's moon phase: *${getMoonPhase(new Date())}*',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}moonphase <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            reply(`🌙 Today's moon phase: *${getMoonPhase(new Date())}*`);
        
    },
};
