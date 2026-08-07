export default {
    config: {
        name: 'flashcardquiz',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No flashcards yet. Add one with .flashcardadd <question>|<answer>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}flashcardquiz <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'flashcards.json');
            const cards = data[sender] || [];
            if (!cards.length) return reply('No flashcards yet. Add one with .flashcardadd <question>|<answer>');
            const pick = cards[Math.floor(Math.random() * cards.length)];
            reply(`❓ ${pick.q}\n\n||${pick.a}||\n(answer hidden above — WhatsApp may not render spoilers, so no peeking! 😄)`);
        
    },
};
