export default {
    config: {
        name: 'numberguesshard',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🎯 I picked a number between 1 and 1000. Guess it with .numberguesshard <number>',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}numberguesshard <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const state = global.numberGuessHard[from];
            if (!state) {
                const target = Math.floor(Math.random() * 1000) + 1;
                global.numberGuessHard[from] = { target, tries: 0 };
                return reply('🎯 I picked a number between 1 and 1000. Guess it with .numberguesshard <number>. You have unlimited tries!');
            }
            const guess = parseInt(args[0]);
            if (isNaN(guess)) return reply('Please guess a number, e.g. .numberguesshard 500');
            state.tries++;
            if (guess === state.target) {
                reply(`🎉 Correct! The number was ${state.target}. You got it in ${state.tries} tries.`);
                delete global.numberGuessHard[from];
            } else if (guess < state.target) {
                reply(`📈 Higher! (try ${state.tries})`);
            } else {
                reply(`📉 Lower! (try ${state.tries})`);
            }
        
    },
};
