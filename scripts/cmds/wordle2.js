export default {
    config: {
        name: 'wordle2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Simple wordle',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}wordle2' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const words = ['apple','brain','chair','dream','eagle','flame','giant','house','juice','knife','lemon','mango','night','ocean','plant','queen','river','snake','tiger','water']; const w = words[Math.floor(Math.random()*words.length)]; global._wdl = global._wdl||{}; global._wdl[from] = {word:w, tries:0}; reply(`📝 *Wordle:*\n\n5-letter word. Start guessing!\nUse ${prefix}wordle2g <guess>`);
    },
};
