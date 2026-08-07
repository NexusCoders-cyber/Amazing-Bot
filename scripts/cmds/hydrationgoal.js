export default {
    config: {
        name: 'hydrationgoal',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .hydrationgoal <weight_kg>nGives a general daily water intake estimate.',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}hydrationgoal <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const weightKg = parseFloat(args[0]);
            if (!weightKg || weightKg <= 0) return reply('Usage: .hydrationgoal <weight_kg>\nGives a general daily water intake estimate.');
            const ml = Math.round(weightKg * 35);
            reply(`💧 General daily water intake estimate for ${weightKg}kg: *~${ml}ml* (${(ml / 250).toFixed(1)} glasses)\nThis is a general guideline, not medical advice — needs vary with activity, climate, and health.`);
        
    },
};
