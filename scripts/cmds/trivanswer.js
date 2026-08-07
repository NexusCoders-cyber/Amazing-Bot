export default {
    config: {
        name: 'trivanswer',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Answer trivia',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}trivanswer' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const ans = global._triv?.[from]; if(!ans) return reply('No active trivia. Start with .trivia2'); const guess = args.join(' ').toLowerCase(); if(guess===ans){delete global._triv[from];reply('🎉 Correct!');}else{reply(`❌ Wrong! Answer was *${ans}*`);delete global._triv[from];}
    },
};
