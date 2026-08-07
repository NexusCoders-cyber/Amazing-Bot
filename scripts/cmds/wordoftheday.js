export default {
    config: {
        name: 'wordoftheday',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '📖 *Word of the Day: ${pick.word}*n${pick.meaning}',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}wordoftheday <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const words = [
                { word: 'Serendipity', meaning: 'the occurrence of events by chance in a happy way' },
                { word: 'Ephemeral', meaning: 'lasting for a very short time' },
                { word: 'Petrichor', meaning: 'the pleasant smell after rain' },
                { word: 'Ubiquitous', meaning: 'present, appearing, or found everywhere' },
                { word: 'Mellifluous', meaning: 'a sound that is sweet and smooth to hear' }
            ];
            const dayIndex = new Date().getDate() % words.length;
            const pick = words[dayIndex];
            reply(`📖 *Word of the Day: ${pick.word}*\n${pick.meaning}`);
        
    },
};
