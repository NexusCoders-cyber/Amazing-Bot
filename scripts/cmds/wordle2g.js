export default {
    config: {
        name: 'wordle2g',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Wordle guess',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}wordle2g' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const g = global._wdl?.[from]; if(!g) return reply('Start with .wordle2'); const guess = args[0]?.toLowerCase(); if(!guess||guess.length!==5) return reply('Enter a 5-letter word'); g.tries++; if(guess===g.word){delete global._wdl[from];reply(`🎉 Correct in ${g.tries} tries!`);return;} const hint = guess.split('').map((c,i)=>c===g.word[i]?'🟢':g.word.includes(c)?'🟡':'⚪').join(''); reply(`${hint}\nTries: ${g.tries}/6`); if(g.tries>=6){reply(`💀 Game over! Word was *${g.word}*`);delete global._wdl[from];}
    },
};
