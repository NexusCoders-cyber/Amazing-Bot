export default {
    config: {
        name: 'colorluminance',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .colorluminance <hex color>nExample: .colorluminance #3498db',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}colorluminance <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text || !/^#?[0-9a-fA-F]{6}$/.test(text.trim())) return reply('Usage: .colorluminance <hex color>\nExample: .colorluminance #3498db');
            const hex = text.trim().replace('#', '');
            const r = parseInt(hex.slice(0, 2), 16) / 255;
            const g = parseInt(hex.slice(2, 4), 16) / 255;
            const b = parseInt(hex.slice(4, 6), 16) / 255;
            const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
            reply(`💡 Relative luminance of #${hex}: *${(lum * 100).toFixed(1)}%*\n${lum > 0.5 ? 'This is a light color — use dark text on it.' : 'This is a dark color — use light text on it.'}`);
        
    },
};
