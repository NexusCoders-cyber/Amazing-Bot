export default {
    config: {
        name: 'trivia2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Quick trivia',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}trivia2' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const q = [{q:'What planet is known as the Red Planet?',a:'Mars'},{q:'How many legs does a spider have?',a:'8'},{q:'What is the largest ocean?',a:'Pacific'},{q:'What gas do plants absorb?',a:'CO2'},{q:'Who painted the Mona Lisa?',a:'Da Vinci'},{q:'What is the speed of light?',a:'300000 km/s'},{q:'How many bones are in the human body?',a:'206'},{q:'What is the hardest natural substance?',a:'Diamond'}]; const pick = q[Math.floor(Math.random()*q.length)]; global._triv = global._triv||{}; global._triv[from] = pick.a.toLowerCase(); reply(`🧠 *Trivia:*\n\n${pick.q}\n\nReply with ${prefix}trivanswer <answer>`);
    },
};
