export default {
    config: {
        name: 'story',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Generate random story',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}story <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const heroes = ['Alice','Bob','Luna','Max','Zara']; const places = ['enchanted forest','mysterious castle','abandoned spaceship','hidden temple','underwater city']; const items = ['magic sword','ancient scroll','glowing orb','mysterious key','crystal gem']; const h = heroes[Math.floor(Math.random()*5)]; const p = places[Math.floor(Math.random()*5)]; const it = items[Math.floor(Math.random()*5)]; reply(`📚 *A Short Story:*\n\nOnce upon a time, ${h} ventured into a ${p}. There, they discovered a ${it} that would change their destiny forever. The End. ✨`);
    },
};
