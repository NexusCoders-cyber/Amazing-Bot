export default {
    config: {
        name: 'riddle',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🧩 *Riddle:*n${pick.q}nn_Reply .revealriddle to see the answer._',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}riddle <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const riddles = [
                { q: 'What has keys but no locks, space but no room, and you can enter but not go in?', a: 'a keyboard' },
                { q: 'The more you take, the more you leave behind. What am I?', a: 'footsteps' },
                { q: 'What has a head and a tail but no body?', a: 'a coin' },
                { q: 'What gets wetter as it dries?', a: 'a towel' },
                { q: 'I speak without a mouth and hear without ears. What am I?', a: 'an echo' }
            ];
            const pick = riddles[Math.floor(Math.random() * riddles.length)];
            reply(`🧩 *Riddle:*\n${pick.q}\n\n_Reply .revealriddle to see the answer._`);
            global.lastRiddleAnswer = pick.a;
        
    },
};
