export default {
    config: {
        name: 'pomodoro',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .pomodoro [minutes]nDefault is 25 minutes. Max 120.',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}pomodoro <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const minutes = parseInt(args[0]) || 25;
            if (minutes < 1 || minutes > 120) return reply('Usage: .pomodoro [minutes]\nDefault is 25 minutes. Max 120.');
            reply(`🍅 Pomodoro started: *${minutes} minutes* of focus. I'll ping you when it's done!`);
            setTimeout(() => {
                King.sendMessage(from, { text: `🔔 *Pomodoro complete!* Time for a break — you focused for ${minutes} minutes.` }, { quoted: m }).catch(() => {});
            }, minutes * 60000);
        
    },
};
