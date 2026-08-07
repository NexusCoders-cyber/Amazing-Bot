export default {
    config: {
        name: 'oddoneout',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '❓ Which one doesn't belong?n${set.map((w, i) => ',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}oddoneout <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const sets = [
                ['Apple', 'Banana', 'Carrot', 'Orange'],
                ['Dog', 'Cat', 'Table', 'Bird'],
                ['Red', 'Blue', 'Happy', 'Green'],
                ['Guitar', 'Piano', 'Drum', 'Book']
            ];
            const set = sets[Math.floor(Math.random() * sets.length)];
            reply(`❓ Which one doesn't belong?\n${set.map((w, i) => `${i + 1}. ${w}`).join('\n')}`);
        
    },
};
