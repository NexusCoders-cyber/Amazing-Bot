export default {
    config: {
        name: 'choose',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Choose between options',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}choose' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const opts = args.join(' ').split(/[|,]/).map(s=>s.trim()).filter(Boolean); if(opts.length<2) return reply('Usage: .choose option1 | option2'); reply(`🎯 I choose: *${opts[Math.floor(Math.random()*opts.length)]}*`);
    },
};
