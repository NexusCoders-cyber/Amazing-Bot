export default {
    config: {
        name: 'getvar',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get environment variable',
        category: 'owner',
        role: 2,
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}getvar <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const v = process.env[args[0]]; reply(v ? `${args[0]} = ${v}` : '❌ Variable not found');
    },
};
