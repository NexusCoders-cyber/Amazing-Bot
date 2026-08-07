import { isDev } from '../../src/utils/devAccess.js';

export default {
    config: {
        name: 'botstats',
        aliases: ['bstat', 'sysinfo'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Detailed bot system info (dev only)',
        category: 'owner',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}botstats' },
    },

    async onStart({ reply, sender, React }) {
        React('📊');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);

        const mem = process.memoryUsage();
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const mins = Math.floor((uptime % 3600) / 60);

        reply([
            `━━━━━━━━━━━━━━━━━━━━`,
            `  📊 *BOT STATISTICS*`,
            `━━━━━━━━━━━━━━━━━━━━`,
            ``,
            `  🖥️ *System*`,
            `  ├ Node.js: ${process.version}`,
            `  ├ Platform: ${process.platform}`,
            `  ├ Arch: ${process.arch}`,
            `  └ PID: ${process.pid}`,
            ``,
            `  💾 *Memory*`,
            `  ├ Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(1)} MB`,
            `  ├ Heap Total: ${(mem.heapTotal / 1024 / 1024).toFixed(1)} MB`,
            `  ├ RSS: ${(mem.rss / 1024 / 1024).toFixed(1)} MB`,
            `  └ External: ${(mem.external / 1024 / 1024).toFixed(1)} MB`,
            ``,
            `  ⏱️ *Uptime*`,
            `  └ ${days}d ${hours}h ${mins}m`,
            ``,
            `  📈 *Process*`,
            `  ├ CPU: ${(process.cpuUsage().user / 1024 / 1024).toFixed(1)} MB`,
            `  └ Uptime: ${Math.floor(uptime)}s`,
            ``,
            `━━━━━━━━━━━━━━━━━━━━`,
        ].join('\n'));
    },
};
