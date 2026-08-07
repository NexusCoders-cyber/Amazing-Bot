export default {
    config: {
        name: 'typingtest',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '⌨️ Type this as fast as you can:nn"${pick}"',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}typingtest <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const sentences = [
                'The quick brown fox jumps over the lazy dog.',
                'Practice makes perfect when learning something new.',
                'Consistency beats intensity in the long run.',
                'A journey of a thousand miles begins with a single step.'
            ];
            const pick = sentences[Math.floor(Math.random() * sentences.length)];
            reply(`⌨️ Type this as fast as you can:\n\n"${pick}"`);
        
    },
};
