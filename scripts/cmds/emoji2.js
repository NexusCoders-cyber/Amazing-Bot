export default {
    config: {
        name: 'emoji2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Emoji combination game',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}emoji2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const pairs = [['🐱','💻','Cat coding'],['🌊','🏄','Surfing'],['🍕','😋','Pizza time'],['🌈','🦄','Magic'],['🚀','🌙','Moon mission'],['🎸','🔥','Rock and roll']]; const [e,_,desc] = pairs[Math.floor(Math.random()*pairs.length)]; reply(`🎭 *Emoji Story:*\n${e}${_}\n\n${desc}!`);
    },
};
