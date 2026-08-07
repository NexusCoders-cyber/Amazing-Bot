export default {
    config: {
        name: 'speedcalc',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .speedcalc <distance km> <time hours>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}speedcalc <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const distance = parseFloat(args[0]);
            const time = parseFloat(args[1]);
            if (!distance || !time) return reply('Usage: .speedcalc <distance km> <time hours>');
            reply(`🚗 Speed: ${(distance / time).toFixed(2)} km/h`);
        
    },
};
