export default {
    config: {
        name: 'repeat',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .repeat <count 1-30> <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}repeat <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const n = parseInt(args[0]);
            const word = args.slice(1).join(' ');
            if (!n || !word || n < 1 || n > 30) return reply('Usage: .repeat <count 1-30> <text>');
            reply(Array(n).fill(word).join(' '));
        
    },
};
