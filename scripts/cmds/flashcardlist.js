export default {
    config: {
        name: 'flashcardlist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No flashcards yet. Add one with .flashcardadd <question>|<answer>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}flashcardlist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'flashcards.json');
            const cards = data[sender] || [];
            if (!cards.length) return reply('No flashcards yet. Add one with .flashcardadd <question>|<answer>');
            reply(`🗂️ *Your Flashcards*\n\n${cards.map((c, i) => `${i + 1}. ${c.q}`).join('\n')}\n\nQuiz yourself with .flashcardquiz`);
        
    },
};
