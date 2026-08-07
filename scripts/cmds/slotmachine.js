export default {
    config: {
        name: 'slotmachine',
        aliases: ['slots'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🎰 [ ${result.join(' | ')} ]n${win ? '🎉 Jackpot!' : 'No luck — try again!'}',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}slotmachine <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const symbols = ['🍒', '🍋', '🍊', '⭐', '💎', '🔔'];
            const spin = () => symbols[Math.floor(Math.random() * symbols.length)];
            const result = [spin(), spin(), spin()];
            const win = result[0] === result[1] && result[1] === result[2];
            reply(`🎰 [ ${result.join(' | ')} ]\n${win ? '🎉 Jackpot!' : 'No luck — try again!'}`);
        
    },
};
