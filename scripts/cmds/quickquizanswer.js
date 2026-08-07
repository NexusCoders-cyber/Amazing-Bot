export default {
    config: {
        name: 'quickquizanswer',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No active quiz. Start one with .quickquiz',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}quickquizanswer <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const answer = global.quickQuizAnswers && global.quickQuizAnswers[from];
            if (!answer) return reply('No active quiz. Start one with .quickquiz');
            reply(`✅ The answer was: *${answer}*`);
            delete global.quickQuizAnswers[from];
        
    },
};
