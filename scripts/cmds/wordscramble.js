export default {
    config: {
        name: 'wordscramble',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🔀 Unscramble this word: *${scrambled}*n(${word.length} letters)',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}wordscramble <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const words = ['elephant', 'guitar', 'sunshine', 'keyboard', 'mountain', 'butterfly', 'chocolate'];
            const word = words[Math.floor(Math.random() * words.length)];
            const scrambled = word.split('').sort(() => Math.random() - 0.5).join('');
            reply(`🔀 Unscramble this word: *${scrambled}*\n(${word.length} letters)`);
        
    },
};
