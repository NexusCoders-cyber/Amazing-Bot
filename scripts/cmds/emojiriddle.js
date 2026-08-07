export default {
    config: {
        name: 'emojiriddle',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🧩 Guess what this is: ${pick.emoji}n(It's a movie or food — think about it!)',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}emojiriddle <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const riddles = [
                { emoji: '🍕🇮🇹', answer: 'pizza' },
                { emoji: '🦁👑', answer: 'lion king' },
                { emoji: '🕷️🧑', answer: 'spiderman' },
                { emoji: '❄️👑', answer: 'frozen' },
                { emoji: '🏠🅰️', answer: 'home alone' }
            ];
            const pick = riddles[Math.floor(Math.random() * riddles.length)];
            reply(`🧩 Guess what this is: ${pick.emoji}\n(It's a movie or food — think about it!)`);
        
    },
};
