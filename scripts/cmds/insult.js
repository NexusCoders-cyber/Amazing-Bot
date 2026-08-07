export default {
    config: {
        name: 'insult',
        aliases: ['roast'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get roasted',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}insult <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const i = ['You have the charisma of a damp napkin','Your code smells like expired milk','I would agree with you but then we would both be wrong','You are the reason god created the middle finger','I am jealous of people who don't know you']; reply(`🔥 ${i[Math.floor(Math.random()*i.length)]}`);
    },
};
