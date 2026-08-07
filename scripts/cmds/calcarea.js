export default {
    config: {
        name: 'calcarea',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .calcarea circle <radius>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}calcarea <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const shape = args[0]?.toLowerCase();
            if (shape === 'circle') {
                const r = parseFloat(args[1]);
                if (!r) return reply('Usage: .calcarea circle <radius>');
                return reply(`⭕ Area: ${(Math.PI * r * r).toFixed(2)}`);
            }
            if (shape === 'rectangle') {
                const w = parseFloat(args[1]), h = parseFloat(args[2]);
                if (!w || !h) return reply('Usage: .calcarea rectangle <width> <height>');
                return reply(`▭ Area: ${(w * h).toFixed(2)}`);
            }
            if (shape === 'triangle') {
                const b = parseFloat(args[1]), h = parseFloat(args[2]);
                if (!b || !h) return reply('Usage: .calcarea triangle <base> <height>');
                return reply(`🔺 Area: ${(0.5 * b * h).toFixed(2)}`);
            }
            reply('Usage: .calcarea <circle|rectangle|triangle> <dimensions>');
        
    },
};
