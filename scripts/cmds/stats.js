export default {
    config: {
        name: 'stats',
        aliases: ['botstats'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Bot statistics',
        category: 'owner',
        role: 2,
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}stats <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const mem = process.memoryUsage(); reply(`📊 *Bot Stats*\n\n💾 RAM: ${(mem.heapUsed/1024/1024).toFixed(1)}MB\n⏱️ Uptime: ${Math.floor((Date.now()-process.uptime()*1000)/1000)}s\n📦 Node: ${process.version}`);
    },
};
