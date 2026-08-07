export default {
    config: {
        name: 'planetfact',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🪐 ${facts[Math.floor(Math.random() * facts.length)]}',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}planetfact <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const facts = [
                "Venus rotates backwards compared to most other planets.",
                "A day on Mercury lasts longer than its year.",
                "Jupiter has at least 95 known moons.",
                "Saturn's rings are made mostly of ice and rock.",
                "Mars has the largest volcano in the solar system, Olympus Mons.",
                "Neptune has winds that can reach 2,100 km/h.",
                "Uranus is tilted almost completely on its side.",
                "Earth is the only planet not named after a god."
            ];
            reply(`🪐 ${facts[Math.floor(Math.random() * facts.length)]}`);
        
    },
};
