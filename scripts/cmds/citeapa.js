export default {
    config: {
        name: 'citeapa',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .citeapa <author>|<year>|<title>|<source>nExample: .citeapa Smith, J.|20',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}citeapa <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text || !text.includes('|')) return reply('Usage: .citeapa <author>|<year>|<title>|<source>\nExample: .citeapa Smith, J.|2020|The Study of Things|Journal of Examples');
            const [author, year, title, source] = text.split('|').map(s => s.trim());
            reply(`📚 *APA Citation*\n\n${author} (${year}). ${title}. ${source}.`);
        
    },
};
