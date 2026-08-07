export default {
    config: {
        name: 'cron2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Parse cron expression',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}cron2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const parts = args[0]?.split(' '); if(!parts||parts.length!==5) return reply('Usage: .cron */5 * * * *'); const [min,hour,dom,mon,dow] = parts; reply(`⏰ Cron: ${args[0]}\nRuns: ${min==='*'?'Every minute':`At minute ${min}`}${hour==='*'?' every hour':` past hour ${hour}`}`);
    },
};
