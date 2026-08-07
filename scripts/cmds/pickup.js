export default {
    config: {
        name: 'pickup',
        aliases: ['pickline'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get a pickup line',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}pickup <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const p = ['Are you a magician? Because whenever I look at you everyone else disappears! ✨','Do you have a map? Because I just got lost in your eyes! 🗺️','Are you a parking ticket? Because you have FINE written all over you! 🎫','Is your name Google? Because you have everything I was searching for! 🔍','Do you believe in love at first sight or should I walk by again? 👀']; reply(p[Math.floor(Math.random()*p.length)]);
    },
};
