export default {
    config: {
        name: 'slugify',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .slugify <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}slugify <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .slugify <text>');
            const slug = text.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
            reply(slug);
        
    },
};
