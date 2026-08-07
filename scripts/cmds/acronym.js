export default {
    config: {
        name: 'acronym',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .acronym <phrase>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}acronym <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .acronym <phrase>');
            const acr = text.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('');
            reply(`🔠 ${acr}`);
        
    },
};
