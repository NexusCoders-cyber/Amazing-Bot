export default {
    config: {
        name: 'fortunecookie',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🥠 ${fortunes[Math.floor(Math.random() * fortunes.length)]}',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}fortunecookie <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const fortunes = [
                "A pleasant surprise is waiting for you.",
                "Your hard work is about to pay off.",
                "An unexpected opportunity will present itself soon.",
                "Good things come to those who wait — and act.",
                "You will make a new friend this week.",
                "A small risk today could lead to a big reward.",
                "Trust your instincts on an important decision."
            ];
            reply(`🥠 ${fortunes[Math.floor(Math.random() * fortunes.length)]}`);
        
    },
};
