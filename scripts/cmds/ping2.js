export default {
    config: {
        name: 'ping2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🏓 Pong! ${Date.now() - start}ms',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}ping2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const start = Date.now();
            reply(`🏓 Pong! ${Date.now() - start}ms`);
        
    },
};
