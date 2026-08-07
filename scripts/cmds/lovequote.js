export default {
    config: {
        name: 'lovequote',
        aliases: ['lq'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Random love quote',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}lovequote' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const q = ['Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day. ❤️','The best thing to hold onto in life is each other. 🤝','In all the world, there is no heart for me like yours. 💕','I love you not because of who you are, but because of who I am when I am with you. 🌹','You are my sun, my moon, and all my stars. ✨']; reply(q[Math.floor(Math.random()*q.length)]);
    },
};
