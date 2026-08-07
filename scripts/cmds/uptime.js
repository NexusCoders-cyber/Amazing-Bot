function fmt(s) {
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60), sc = Math.floor(s % 60);
    if (d > 0) return `${d}d ${h}h ${m}m ${sc}s`;
    if (h > 0) return `${h}h ${m}m ${sc}s`;
    if (m > 0) return `${m}m ${sc}s`;
    return `${sc}s`;
}
export default {
    config: {
        name: 'uptime',
        aliases: ['ut', 'runtime'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Check how long the bot has been running',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}uptime' },
    },
    async onStart({ reply }) {
        const s = process.uptime();
        const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
        reply(`Uptime : ${fmt(s)}\nRAM    : ${mem} MB\nNode   : ${process.version}`);
    },
};
