export default {
    config: {
        name: 'ping',
        aliases: ['speed', 'alive', 'test'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Check bot response speed',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}ping' },
    },
    async onStart({ sock, message, from, reply }) {
        const t = Date.now();
        const sent = await reply('Pinging...');
        const ms = Date.now() - t;
        const mem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
        await sock.sendMessage(from, {
            text: `Pong!\nSpeed  : ${ms}ms\nRAM    : ${mem} MB\nNode   : ${process.version}`,
            edit: sent.key,
        });
    },
};
