export default {
    config: {
        name: 'setprefix2',
        aliases: ['prefix2'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Set bot prefix',
        category: 'owner',
        role: 2,
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}setprefix2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const p = args[0]; if(!p) return reply('Usage: .setprefix <char>'); reply(`✅ Prefix set to: *${p}*`);
    },
};
