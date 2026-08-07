export default {
    config: {
        name: 'randomcolor',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🎨 Random color: ${hex}',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}randomcolor <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const hex = '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0');
            reply(`🎨 Random color: ${hex}`);
        
    },
};
