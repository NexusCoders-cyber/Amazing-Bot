export default {
    config: {
        name: 'hex2rgb',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .hex2rgb <hex color, e.g. ff00aa>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}hex2rgb <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            let hex = (args[0] || '').replace('#', '');
            if (!/^[0-9a-fA-F]{6}$/.test(hex)) return reply('Usage: .hex2rgb <hex color, e.g. ff00aa>');
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);
            reply(`🎨 RGB(${r}, ${g}, ${b})`);
        
    },
};
