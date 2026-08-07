export default {
    config: {
        name: 'colorguess',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🎨 What color is closest to this? *${hex}*nRGB: (${r}, ${g}, ${b})',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}colorguess <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
            reply(`🎨 What color is closest to this? *${hex}*\nRGB: (${r}, ${g}, ${b})`);
        
    },
};
