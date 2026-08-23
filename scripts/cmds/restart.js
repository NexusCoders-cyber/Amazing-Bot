export default {
    config: {
        name: 'restart',
        aliases: ['reboot'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Restart the bot process',
        category: 'owner',
        coolDown: 5,
        role: 2,
        guide: { en: '{prefix}restart' },
    },

    async onStart({ reply }) {
        await reply('🔄 Restarting AmazingBot...\n⏳ It should reconnect in a few seconds.');
        setTimeout(() => process.exit(0), 1500);
    },
};
