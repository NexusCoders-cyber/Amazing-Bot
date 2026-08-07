export default {
    config: {
        name: 'citemla',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .citemla <author>|<title>|<source>|<year>nExample: .citemla Smith, John|',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}citemla <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text || !text.includes('|')) return reply('Usage: .citemla <author>|<title>|<source>|<year>\nExample: .citemla Smith, John|The Study of Things|Journal of Examples|2020');
            const [author, title, source, year] = text.split('|').map(s => s.trim());
            reply(`📚 *MLA Citation*\n\n${author}. "${title}." ${source}, ${year}.`);
        
    },
};
