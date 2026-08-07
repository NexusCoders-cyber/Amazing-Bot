export default {
    config: {
        name: 'bmi',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .bmi <weight in kg> <height in cm>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}bmi <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const kg = parseFloat(args[0]);
            const cm = parseFloat(args[1]);
            if (!kg || !cm) return reply('Usage: .bmi <weight in kg> <height in cm>');
            const m = cm / 100;
            const bmi = kg / (m * m);
            let category = 'Normal weight';
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi >= 25 && bmi < 30) category = 'Overweight';
            else if (bmi >= 30) category = 'Obese';
            reply(`⚖️ BMI: ${bmi.toFixed(1)} (${category})`);
        
    },
};
