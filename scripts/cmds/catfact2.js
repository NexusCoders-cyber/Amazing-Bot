export default {
    config: { name: 'catfact2', aliases: ['catf'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Random cat fact', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}catfact2' } },
    async onStart({ reply, React }) {
        React('🐱');
        const facts = ['Cats sleep for 12-16 hours a day','A group of cats is called a clowder','Cats have over 20 vocalizations','A cat\'s purr vibrates at 25-150 Hz','Cats can rotate their ears 180 degrees','Cats can jump up to 6 times their length','A cat\'s brain is 90% similar to a human\'s','Cats have a third eyelid called a haw','Cats can run up to 30 mph','A cat\'s nose is unique like a fingerprint'];
        reply(`🐱 *Cat Fact:*\n${facts[Math.floor(Math.random() * facts.length)]}`);
    },
};
