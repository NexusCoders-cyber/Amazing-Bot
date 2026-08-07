export default {
    config: {
        name: '8ball2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Magic 8 ball v2',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}8ball2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const r = ['🟢 Yes!','🟢 Absolutely!','🟢 For sure!','🟢 Definitely!','🟡 Maybe...','🟡 Could be!','🟡 Ask again later','🔴 No way!','🔴 Definitely not!','🔴 Not a chance!']; reply(`🎱 *${r[Math.floor(Math.random()*r.length)]}*`);
    },
};
