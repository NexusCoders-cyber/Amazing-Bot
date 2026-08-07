export default {
    config: {
        name: 'restart',
        aliases: ['reboot'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Restart the bot',
        category: 'owner',
        coolDown: 10,
        role: 2,
        guide: { en: '{prefix}restart' },
    },

    async onStart({ reply, isOwner, React }) {
        React('🔄');
        if (!isOwner) return reply(`❌ Owner only!`);

        reply(`🔄 Restarting bot...`).then(() => {
            process.exit(0);
        });
    },
};
