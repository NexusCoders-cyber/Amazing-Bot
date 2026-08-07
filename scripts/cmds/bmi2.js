export default {
    config: {
        name: 'bmi2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Calculate BMI',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}bmi2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const [kg,cm] = args.map(Number); if(!kg||!cm) return reply('Usage: .bmi <kg> <cm>'); const m=cm/100; const bmi=kg/(m*m); reply(`⚖️ BMI: ${bmi.toFixed(1)}
        ${bmi<18.5?'📉 Underweight':bmi<25?'✅ Normal':bmi<30?'⚠️ Overweight':'🔴 Obese'}`);
    },
};
