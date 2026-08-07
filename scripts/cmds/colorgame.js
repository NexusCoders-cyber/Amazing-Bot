export default {
    config: {
        name: 'colorgame',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Guess the color',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}colorgame' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const colors = ['🔴 Red','🟢 Green','🔵 Blue','🟡 Yellow','🟣 Purple','🟠 Orange','⚫ Black','⚪ White','🩷 Pink','🟤 Brown']; const pick = colors[Math.floor(Math.random()*colors.length)]; global._cg = global._cg||{}; global._cg[from] = pick.toLowerCase().split(' ')[1]; reply(`🎨 *Color Game:*\n\nI picked a color! Guess it with ${prefix}colorgameg <color>\n\nOptions: ${colors.join(', ')}`);
    },
};
