export default {
    config: {
        name: '8choice',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '8 ball choice maker',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}8choice' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const q = ['🎱 Definitely yes!','🎱 Maybe...','🎱 Try again later','🎱 No way!','🎱 Absolutely!','🎱 Not sure','🎱 Probably','🎱 Ask your cat']; reply(q[Math.floor(Math.random()*q.length)]);
    },
};
