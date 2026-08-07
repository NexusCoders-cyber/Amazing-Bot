export default {
    config: {
        name: 'scramble2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Word scramble',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}scramble2' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const words = ['apple','brain','chair','dream','eagle','flame','giant','house','juice','knife','lemon','mango','night','ocean','plant','queen','river','snake','tiger','water']; const w = words[Math.floor(Math.random()*words.length)]; const s = w.split('').sort(()=>Math.random()-0.5).join(''); global._scr = global._scr||{}; global._scr[from] = w; reply(`🔤 *Scramble:*\n\n\`${s}\`\n\nGuess with ${prefix}scramble2g <word>`);
    },
};
