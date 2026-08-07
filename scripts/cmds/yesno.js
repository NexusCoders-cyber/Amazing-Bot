export default {
    config: {
        name: 'yesno',
        aliases: ['yn'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Yes or no answer',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}yesno' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        reply(Math.random()>0.5?'🟢 *YES*':'🔴 *NO*');
    },
};
