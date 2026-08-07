export default {
    config: {
        name: 'countdown2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Countdown to date',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}countdown2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const d = new Date(args.join(' ')); if(isNaN(d)) return reply('Usage: .countdown YYYY-MM-DD'); const diff = d - Date.now(); if(diff<0) return reply('That date has passed!'); const days = Math.floor(diff/864e5); const hours = Math.floor((diff%864e5)/36e5); reply(`⏰ *${days}* days, *${hours}* hours remaining`);
    },
};
