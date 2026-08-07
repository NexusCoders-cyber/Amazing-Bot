export default {
    config: {
        name: 'roll',
        aliases: ['dice'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Roll a dice',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}roll <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const dice = ['⚀','⚁','⚂','⚃','⚄','⚅']; const faces = [1,2,3,4,5,6]; const idx = Math.floor(Math.random()*6); reply(`${dice[idx]} You rolled a *${faces[idx]}*`);
    },
};
