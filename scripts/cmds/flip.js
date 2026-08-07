export default {
    config: {
        name: 'flip',
        aliases: ['coinflip2'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Flip a coin',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}flip <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const side = Math.random() > 0.5 ? 'Heads 🪙' : 'Tails 🪙'; reply(`🪙 *${side}*`);
    },
};
