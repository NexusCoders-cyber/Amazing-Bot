export default {
    config: {
        name: 'rate',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Rate something 1-10',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}rate <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const thing = args.join(' '); const r = Math.floor(Math.random()*11); reply(`⭐ I rate *${thing}* a ${r}/10`);
    },
};
