export default {
    config: {
        name: 'dogfact',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🐶 ${facts[Math.floor(Math.random() * facts.length)]}',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}dogfact <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const facts = [
                "Dogs have about 300 million scent receptors, compared to a human's 6 million.",
                "A dog's nose print is as unique as a human's fingerprint.",
                "Puppies are born deaf and blind.",
                "The Basenji is known as the 'barkless dog'.",
                "Dogs can smell fear and other emotions through chemical changes in our scent."
            ];
            reply(`🐶 ${facts[Math.floor(Math.random() * facts.length)]}`);
        
    },
};
