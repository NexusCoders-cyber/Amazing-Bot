export default {
    config: {
        name: 'flipcoinbet',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .flipcoinbet <heads|tails>',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}flipcoinbet <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const call = (args[0] || '').toLowerCase();
            if (!['heads', 'tails'].includes(call)) return reply('Usage: .flipcoinbet <heads|tails>');
            const result = Math.random() < 0.5 ? 'heads' : 'tails';
            reply(result === call ? `🪙 It's ${result}! You called it right! 🎉` : `🪙 It's ${result}. Better luck next time!`);
        
    },
};
