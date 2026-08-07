export default {
    config: {
        name: 'mathquiz',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🧮 What is ${a} ${op} ${b}?nReply with .mathanswer <number>',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}mathquiz <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const a = Math.floor(Math.random() * 50) + 1;
            const b = Math.floor(Math.random() * 50) + 1;
            const ops = ['+', '-', '*'];
            const op = ops[Math.floor(Math.random() * ops.length)];
            const answer = op === '+' ? a + b : op === '-' ? a - b : a * b;
            global.mathQuizGames = global.mathQuizGames || {};
            global.mathQuizGames[from] = answer;
            reply(`🧮 What is ${a} ${op} ${b}?\nReply with .mathanswer <number>`);
        
    },
};
