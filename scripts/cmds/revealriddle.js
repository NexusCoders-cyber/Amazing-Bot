export default {
    config: {
        name: 'revealriddle',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No riddle has been asked yet.',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}revealriddle <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!global.lastRiddleAnswer) return reply('No riddle has been asked yet.');
            reply(`💡 Answer: ${global.lastRiddleAnswer}`);
        
    },
};
