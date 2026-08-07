export default {
    config: {
        name: 'guessnumber',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🔢 I picked a number between 1-100. Guess it with .guess <number>nYou have 7 tr',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}guessnumber <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const target = Math.floor(Math.random() * 100) + 1;
            global.guessNumberGames = global.guessNumberGames || {};
            global.guessNumberGames[from] = { target, tries: 0 };
            reply('🔢 I picked a number between 1-100. Guess it with .guess <number>\nYou have 7 tries.');
        
    },
};
