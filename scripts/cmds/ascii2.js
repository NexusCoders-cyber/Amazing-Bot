export default {
    config: {
        name: 'ascii2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Convert number to ascii',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}ascii2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const n = parseInt(args[0]); if(isNaN(n)) return reply('Usage: .ascii 65'); reply(`${n} = *${String.fromCharCode(n)}*`);
    },
};
