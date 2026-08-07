export default {
    config: { name: 'remind2', aliases: ['remindme'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Set a reminder', category: 'utility', coolDown: 5, role: 0, guide: { en: '{prefix}remind2 <minutes> <message>' } },
    async onStart({ args, reply, prefix, React }) {
        React('⏰');
        if (args.length < 2) return reply(`Usage: ${prefix}remind2 <minutes> <message>`);
        const mins = parseInt(args[0]); if (isNaN(mins) || mins < 1 || mins > 1440) return reply('Minutes must be 1-1440');
        const msg = args.slice(1).join(' ');
        setTimeout(() => reply(`⏰ *Reminder:* ${msg}`), mins * 60000);
        reply(`✅ Reminder set for *${mins} minute${mins > 1 ? 's' : ''}* from now.\n📝 ${msg}`);
    },
};
