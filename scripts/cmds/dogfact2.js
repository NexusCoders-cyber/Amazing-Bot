export default {
    config: { name: 'dogfact2', aliases: ['dogf'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Random dog fact', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}dogfact2' } },
    async onStart({ reply, React }) {
        React('🐶');
        const facts = ['Dogs can smell 10,000 times better than humans','A dog\'s nose is as unique as a fingerprint','Dogs can understand up to 250 words','Dogs dream just like humans','A Greyhound can run up to 45 mph','Dogs have three eyelids','Puppies are born deaf','A dog\'s normal body temperature is 101.5°F','Dogs can see in color, just not as vividly','A Basenji is the only breed that doesn\'t bark'];
        reply(`🐶 *Dog Fact:*\n${facts[Math.floor(Math.random() * facts.length)]}`);
    },
};
