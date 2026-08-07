export default {
    config: {
        name: 'memorytest',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🧠 Memorize these 5 words for 10 seconds:n${shuffled.join(', ')}nnI'll ask yo',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}memorytest <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const items = ['apple', 'car', 'moon', 'guitar', 'river', 'clock', 'forest', 'candle'];
            const shuffled = items.sort(() => Math.random() - 0.5).slice(0, 5);
            reply(`🧠 Memorize these 5 words for 10 seconds:\n${shuffled.join(', ')}\n\nI'll ask you to recall them shortly... (in a full implementation this would follow up automatically)`);
        
    },
};
