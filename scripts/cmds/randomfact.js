export default {
    config: {
        name: 'randomfact',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '💡 ${facts[Math.floor(Math.random() * facts.length)]}',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}randomfact <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const facts = [
                'Honey never spoils if stored properly.',
                'Octopuses have three hearts.',
                'Bananas are berries, but strawberries are not.',
                'A day on Venus is longer than a year on Venus.',
                'Sharks existed before trees.',
                'The Eiffel Tower can grow taller in summer heat.',
                'Wombat poop is cube-shaped.',
                'A group of flamingos is called a "flamboyance".'
            ];
            reply(`💡 ${facts[Math.floor(Math.random() * facts.length)]}`);
        
    },
};
