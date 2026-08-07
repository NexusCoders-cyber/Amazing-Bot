export default {
    config: {
        name: 'quickquiz',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '❔ ${pick.q}nType .quickquizanswer to reveal the answer once you've guessed.',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}quickquiz <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const questions = [
                { q: 'What is the capital of Japan?', a: 'Tokyo' },
                { q: 'How many continents are there?', a: '7' },
                { q: 'What is the largest planet in our solar system?', a: 'Jupiter' },
                { q: 'Who painted the Mona Lisa?', a: 'Leonardo da Vinci' },
                { q: 'What is the chemical symbol for gold?', a: 'Au' }
            ];
            const pick = questions[Math.floor(Math.random() * questions.length)];
            global.quickQuizAnswers = global.quickQuizAnswers || {};
            global.quickQuizAnswers[from] = pick.a;
            reply(`❔ ${pick.q}\nType .quickquizanswer to reveal the answer once you've guessed.`);
        
    },
};
