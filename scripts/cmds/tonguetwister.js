export default {
    config: {
        name: 'tonguetwister',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '👅 Try saying this 5 times fast:n"${twisters[Math.floor(Math.random() * twister',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}tonguetwister <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const twisters = [
                "She sells seashells by the seashore.",
                "Peter Piper picked a peck of pickled peppers.",
                "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
                "Fuzzy Wuzzy was a bear. Fuzzy Wuzzy had no hair.",
                "Betty Botter bought some butter, but she said the butter's bitter."
            ];
            reply(`👅 Try saying this 5 times fast:\n"${twisters[Math.floor(Math.random() * twisters.length)]}"`);
        
    },
};
