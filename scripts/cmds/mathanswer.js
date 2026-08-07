export default {
    config: {
        name: 'mathanswer',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No active math quiz. Start one with .mathquiz',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}mathanswer <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const answer = global.mathQuizGames && global.mathQuizGames[from];
            if (answer === undefined) return reply('No active math quiz. Start one with .mathquiz');
            const guess = parseInt(args[0]);
            if (guess === answer) {
                reply('🎉 Correct!');
                delete global.mathQuizGames[from];
            } else {
                reply('❌ Not quite — try again!');
            }
        
    },
};
