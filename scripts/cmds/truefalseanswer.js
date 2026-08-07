export default {
    config: {
        name: 'truefalseanswer',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No active True/False game. Start one with .truefalse',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}truefalseanswer <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const correct = global.trueFalseGame && global.trueFalseGame[from];
            if (correct === undefined) return reply('No active True/False game. Start one with .truefalse');
            const guess = (args[0] || '').toLowerCase();
            if (guess !== 'true' && guess !== 'false') return reply('Reply with .truefalseanswer true or .truefalseanswer false');
            const guessBool = guess === 'true';
            reply(guessBool === correct ? '🎉 Correct!' : `❌ Wrong — the answer was ${correct}.`);
            delete global.trueFalseGame[from];
        
    },
};
