export default {
    config: {
        name: 'vocabadd',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .vocabadd <word>|<meaning>nExample: .vocabadd ephemeral|lasting a very s',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}vocabadd <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text || !text.includes('|')) return reply('Usage: .vocabadd <word>|<meaning>\nExample: .vocabadd ephemeral|lasting a very short time');
            const [word, meaning] = text.split('|').map(s => s.trim());
            const data = load(fs, fsx, 'vocab.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ word, meaning });
            save(fs, 'vocab.json', data);
            reply(`📖 Added "${word}" to your vocab list.`);
        
    },
};
