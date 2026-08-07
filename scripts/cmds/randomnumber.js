export default {
    config: {
        name: 'randomnumber',
        aliases: ['rnum'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .randomnumber <min> <max>',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}randomnumber <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const min = parseInt(args[0]);
            const max = parseInt(args[1]);
            if (isNaN(min) || isNaN(max) || min >= max) return reply('Usage: .randomnumber <min> <max>');
            reply(`🔢 ${Math.floor(Math.random() * (max - min + 1)) + min}`);
        
    },
};
