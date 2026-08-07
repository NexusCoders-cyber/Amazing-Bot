import axios from 'axios';

export default {
    config: {
        name: 'define',
        aliases: ['dictionary', 'dict'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get dictionary definition of a word',
        category: 'fun',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}define <word>' },
    },
    async onStart({ args, reply }) {
        if (!args.length) return reply('Usage: define <word>');

        const word = args[0].toLowerCase();
        try {
            const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { timeout: 10000 });
            const entry = data[0];
            if (!entry) return reply(`No definition found for "${word}".`);

            const phonetic = entry.phonetic || '';
            const meanings = entry.meanings.slice(0, 3).map(m => {
                const defs = m.definitions.slice(0, 2).map((d, i) => `  ${i + 1}. ${d.definition}`).join('\n');
                return `*${m.partOfSpeech}*\n${defs}`;
            }).join('\n\n');

            reply(`📖 *${word}* ${phonetic}\n\n${meanings}`);
        } catch {
            reply(`No definition found for "${word}".`);
        }
    },
};
