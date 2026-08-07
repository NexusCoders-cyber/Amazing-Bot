export default {
    config: {
        name: 'vocablist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No vocab words saved. Add one with .vocabadd <word>|<meaning>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}vocablist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'vocab.json');
            const words = data[sender] || [];
            if (!words.length) return reply('No vocab words saved. Add one with .vocabadd <word>|<meaning>');
            reply(`📖 *Your Vocab List*\n\n${words.map(w => `${w.word}: ${w.meaning}`).join('\n')}`);
        
    },
};
