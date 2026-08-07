export default {
    config: {
        name: 'pun',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '😂 ${puns[Math.floor(Math.random() * puns.length)]}',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}pun <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const puns = [
                "I'm reading a book on anti-gravity. It's impossible to put down.",
                "I used to be a banker, but I lost interest.",
                "I'm on a seafood diet. I see food and I eat it.",
                "Time flies like an arrow. Fruit flies like a banana.",
                "I would tell you a chemistry joke, but I know I wouldn't get a reaction."
            ];
            reply(`😂 ${puns[Math.floor(Math.random() * puns.length)]}`);
        
    },
};
