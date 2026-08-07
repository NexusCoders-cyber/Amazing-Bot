export default {
    config: {
        name: 'wisdom',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Random wisdom',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}wisdom' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const w = ['The quieter you become, the more you can hear. 👂','Knowledge speaks, but wisdom listens. 🧠','Yesterday is history, tomorrow is a mystery, today is a gift — that\'s why they call it the present. 🎁','It is during our darkest moments that we must focus to see the light. 🌟','The only true wisdom is in knowing you know nothing. — Socrates 📚']; reply(w[Math.floor(Math.random()*w.length)]);
    },
};
