export default {
    config: {
        name: 'stretchreminder',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🧘 Time for a quick stretch:n${stretches[Math.floor(Math.random() * stretches.l',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}stretchreminder <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const stretches = [
                "Neck rolls — slowly roll your head in a circle, 5 times each direction.",
                "Shoulder shrugs — lift shoulders to your ears, hold 3 seconds, release. Repeat 10x.",
                "Seated spinal twist — sit tall, twist gently to each side, hold 15 seconds.",
                "Wrist stretches — extend your arm, gently pull fingers back, hold 15 seconds each hand.",
                "Standing forward fold — hinge at hips, let arms hang, hold 20 seconds.",
                "Calf raises — stand and rise onto your toes 15 times to boost circulation."
            ];
            reply(`🧘 Time for a quick stretch:\n${stretches[Math.floor(Math.random() * stretches.length)]}`);
        
    },
};
