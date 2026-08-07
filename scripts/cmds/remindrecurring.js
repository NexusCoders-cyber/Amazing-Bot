export default {
    config: {
        name: 'remindrecurring',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .remindrecurring <HH:mm> <message>nExample: .remindrecurring 08:00 Take ',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}remindrecurring <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .remindrecurring <HH:mm> <message>\nExample: .remindrecurring 08:00 Take vitamins\n(Runs daily at that time while the bot is online.)');
            const time = args[0];
            if (!/^\d{1,2}:\d{2}$/.test(time)) return reply('Please provide time as HH:mm, e.g. 08:00');
            const message = args.slice(1).join(' ');
            const data = load(fs, fsx, 'recurring.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ time, message, chat: from });
            save(fs, 'recurring.json', data);
            reply(`🔁 Daily reminder set for ${time}: "${message}"\n(Note: this relies on the bot staying online — reminders won't fire during downtime.)`);

            const [h, mnt] = time.split(':').map(Number);
            const scheduleNext = () => {
                const now = new Date();
                const next = new Date();
                next.setHours(h, mnt, 0, 0);
                if (next <= now) next.setDate(next.getDate() + 1);
                const delay = next - now;
                setTimeout(() => {
                    King.sendMessage(from, { text: `🔁 *Daily reminder:* ${message}` }, { quoted: m }).catch(() => {});
                    scheduleNext();
                }, delay);
            };
            scheduleNext();
        
    },
};
