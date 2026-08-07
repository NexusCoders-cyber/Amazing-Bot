export default {
    config: {
        name: 'colorgameg',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Color game guess',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}colorgameg' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const c = global._cg?.[from]; if(!c) return reply('Start with .colorgame'); if(args[0]?.toLowerCase()===c){delete global._cg[from];reply('🎉 Correct!');}else{reply(`❌ Wrong! Answer was *${c}*`);delete global._cg[from];}
    },
};
