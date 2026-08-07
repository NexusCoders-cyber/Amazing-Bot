export default {
    config: {
        name: 'posturecheck',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🪑 Posture check! Feet flat on the floor, back straight against your chair, shou',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}posturecheck <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            reply('🪑 Posture check! Feet flat on the floor, back straight against your chair, shoulders relaxed (not hunched), screen at eye level. Take a breath and reset.');
        
    },
};
