export default {
    config: {
        name: 'neverhaveiever',
        aliases: ['nhie'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Never have I ever',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}neverhaveiever <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const q = ['...eaten a bug','...lied to a teacher','...broken a bone','...been arrested','...cheated on a test','...stalked an ex','...sent a wrong text','...cried at a movie','...fallen in public','...broken a phone screen']; reply(`🔞 *Never Have I Ever*
        
        ${q[Math.floor(Math.random()*q.length)]}
        
        Reply yes or no!`);
    },
};
