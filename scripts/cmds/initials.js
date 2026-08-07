export default {
    config: {
        name: 'initials',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .initials <full name>',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}initials <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .initials <full name>');
            const initials = text.trim().split(/\s+/).map(w => w[0].toUpperCase()).join('');
            reply(`🔠 Initials: *${initials}*`);
        
    },
};
