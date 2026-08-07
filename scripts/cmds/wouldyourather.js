export default {
    config: {
        name: 'wouldyourather',
        aliases: ['wyr'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Would you rather',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}wouldyourather <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const q = [['🏔️ Climb Everest','🌊 Swim the Atlantic'],['🗣️ Be famous','💰 Be rich'],['⚡ Super speed','🦹 Super strength'],['🐰 Talk to animals','🗣️ Talk to dead'],['🌍 Save the world','💰 Save yourself']]; const [a,b] = q[Math.floor(Math.random()*q.length)]; reply(`❓ *Would You Rather?*
        
        🅰️ ${a}
        
        🅱️ ${b}
        
        React with 🅰️ or 🅱️`);
    },
};
