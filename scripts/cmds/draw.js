export default {
    config: {
        name: 'draw',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Random drawing prompt',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}draw <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const p = ['a cat wearing a top hat','a dragon eating ice cream','a robot playing guitar','a UFO over a city','a underwater castle','a space whale','a steampunk owl','a cyberpunk street','a fairy garden','a crystal cave']; reply(`🎨 *Drawing Prompt:*\n\nDraw ${p[Math.floor(Math.random()*p.length)]}!`);
    },
};
