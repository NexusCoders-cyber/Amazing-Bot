export default {
    config: {
        name: 'flashcardadd',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .flashcardadd <question>|<answer>nExample: .flashcardadd Capital of Fran',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}flashcardadd <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text || !text.includes('|')) return reply('Usage: .flashcardadd <question>|<answer>\nExample: .flashcardadd Capital of France|Paris');
            const [q, a] = text.split('|').map(s => s.trim());
            if (!q || !a) return reply('Please provide both a question and answer separated by |');
            const data = load(fs, fsx, 'flashcards.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ q, a });
            save(fs, 'flashcards.json', data);
            reply(`🗂️ Flashcard added (${data[sender].length} total): "${q}"`);
        
    },
};
