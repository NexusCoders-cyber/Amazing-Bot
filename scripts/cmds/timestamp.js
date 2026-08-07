export default {
    config: {
        name: 'timestamp',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🕒 Unix timestamp: ${Math.floor(now.getTime() / 1000)}nISO: ${now.toISOString()',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}timestamp <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const now = new Date();
            reply(`🕒 Unix timestamp: ${Math.floor(now.getTime() / 1000)}\nISO: ${now.toISOString()}`);
        
    },
};
