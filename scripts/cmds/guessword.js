export default {
    config: {
        name: 'guessword',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Answer unscramble',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}guessword <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const ans = global._uns?.[from]; if (!ans) return reply('No active game. Start with .unscramble'); if (args[0].toLowerCase() === ans.toLowerCase()) { delete global._uns[from]; reply('🎉 Correct!'); } else { reply(`❌ Wrong! Answer was *${ans}*`); delete global._uns[from]; }
    },
};
