export default {
    config: {
        name: 'countdown3',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Countdown timer',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}countdown3 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const secs = parseInt(args[0]); if(!secs||secs>300) return reply('Usage: .countdown <seconds> (max 300)'); reply(`⏱️ Countdown: ${secs} seconds starting...`); setTimeout(()=>reply('⏰ *Time\'s up!*'), secs*1000);
    },
};
