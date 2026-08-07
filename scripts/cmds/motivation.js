export default {
    config: {
        name: 'motivation',
        aliases: ['motiv'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Motivational quote',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}motivation' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const q = ['The only way to do great work is to love what you do. — Steve Jobs 💪','Believe you can and you\'re halfway there. — Theodore Roosevelt 🌟','Success is not final, failure is not fatal: it is the courage to continue that counts. — Winston Churchill 🔥','Don\'t watch the clock; do what it does. Keep going. ⏰','Every expert was once a beginner. 🎯']; reply(q[Math.floor(Math.random()*q.length)]);
    },
};
