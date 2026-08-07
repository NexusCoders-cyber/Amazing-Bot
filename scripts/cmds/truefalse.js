export default {
    config: {
        name: 'truefalse',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '❓ True or False: "${pick.text}"nReply with .truefalseanswer true or .truefalsea',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}truefalse <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const statements = [
                { text: 'The Great Wall of China is visible from space with the naked eye.', answer: false },
                { text: 'Sharks existed before trees.', answer: true },
                { text: 'A bolt of lightning is hotter than the surface of the sun.', answer: true },
                { text: 'Goldfish have a memory span of only 3 seconds.', answer: false },
                { text: 'Humans share about 50% of their DNA with bananas.', answer: true }
            ];
            const pick = statements[Math.floor(Math.random() * statements.length)];
            global.trueFalseGame = global.trueFalseGame || {};
            global.trueFalseGame[from] = pick.answer;
            reply(`❓ True or False: "${pick.text}"\nReply with .truefalseanswer true or .truefalseanswer false`);
        
    },
};
