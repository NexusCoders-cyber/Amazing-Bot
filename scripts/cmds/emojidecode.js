export default {
    config: {
        name: 'emojidecode',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .emojidecode <emoji>',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}emojidecode <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .emojidecode <emoji>');
            const codepoints = [...text].map(ch => 'U+' + ch.codePointAt(0).toString(16).toUpperCase());
            reply(`🔡 Unicode codepoint(s): ${codepoints.join(', ')}`);
        
    },
};
