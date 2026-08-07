export default {
    config: {
        name: 'randomquote',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '💬 "${quotes[Math.floor(Math.random() * quotes.length)]}"',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}randomquote <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const quotes = [
                'The only way to do great work is to love what you do.',
                'Success is not final, failure is not fatal.',
                'Simplicity is the ultimate sophistication.',
                'Do or do not. There is no try.',
                'What you get by achieving your goals is not as important as what you become by achieving your goals.'
            ];
            reply(`💬 "${quotes[Math.floor(Math.random() * quotes.length)]}"`);
        
    },
};
