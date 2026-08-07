export default {
    config: {
        name: 'guess',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No active game. Start one with .guessnumber',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}guess <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const game = global.guessNumberGames && global.guessNumberGames[from];
            if (!game) return reply('No active game. Start one with .guessnumber');
            const num = parseInt(args[0]);
            if (isNaN(num)) return reply('Usage: .guess <number>');
            game.tries++;
            if (num === game.target) {
                reply(`🎉 Correct! The number was ${game.target}. Solved in ${game.tries} tries.`);
                delete global.guessNumberGames[from];
            } else if (game.tries >= 7) {
                reply(`❌ Out of tries! The number was ${game.target}.`);
                delete global.guessNumberGames[from];
            } else {
                reply(`${num < game.target ? '⬆️ Higher!' : '⬇️ Lower!'} (${7 - game.tries} tries left)`);
            }
        
    },
};
