export default {
    config: {
        name: 'howold',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Guess how old someone is',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}howold <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        reply(`🔢 I think you are *${Math.floor(Math.random()*60)+10}* years old! 🤔`);
    },
};
