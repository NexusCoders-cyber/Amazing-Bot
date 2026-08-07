export default {
    config: {
        name: 'dadfact',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '👨 ${facts[Math.floor(Math.random() * facts.length)]}',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}dadfact <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const facts = [
                "A group of flamingos is called a 'flamboyance'.",
                "Bananas are berries, but strawberries aren't.",
                "Honey never spoils — archaeologists found 3000-year-old honey that was still edible.",
                "Octopuses have three hearts.",
                "A day on Venus is longer than a year on Venus.",
                "The shortest war in history lasted 38 minutes.",
                "Wombat poop is cube-shaped."
            ];
            reply(`👨 ${facts[Math.floor(Math.random() * facts.length)]}`);
        
    },
};
