export default {
    config: {
        name: 'scramble2g',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Scramble guess',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}scramble2g' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const w = global._scr?.[from]; if(!w) return reply('Start with .scramble2'); if(args[0]?.toLowerCase()===w){delete global._scr[from];reply('🎉 Correct!');}else{reply(`❌ Wrong! Answer was *${w}*`);delete global._scr[from];}
    },
};
