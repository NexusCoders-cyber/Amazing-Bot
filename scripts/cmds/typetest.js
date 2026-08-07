export default {
    config: {
        name: 'typetest',
        aliases: ['typing'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Typing speed test',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}typetest <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const words = ['apple','banana','elephant','keyboard','python','javascript','whatsapp','galaxy','quantum','thunder']; const word = words[Math.floor(Math.random()*words.length)]; reply(`⌨️ *Typing Test:*\n\nType this word as fast as you can:\n\n*${word}*\n\nStart time: ${Date.now()}`); global._typetest = global._typetest||{}; global._typetest[from] = {word, time: Date.now()};
    },
};
