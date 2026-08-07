export default {
    config: {
        name: 'roast2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Random roast',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}roast2' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const r = ['You have the personality of a wet sock','Your code is so bad it made the server cry','I would explain it to you but I left my English-to-Idiot dictionary at home','You bring everyone a lot of joy... when you leave','You are the human equivalent of a pop-up ad']; reply(`🔥 *Roast:*\n${r[Math.floor(Math.random()*r.length)]}`);
    },
};
