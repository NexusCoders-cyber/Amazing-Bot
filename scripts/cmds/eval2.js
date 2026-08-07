export default {
    config: {
        name: 'eval2',
        aliases: ['ev'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Evaluate JS code',
        category: 'owner',
        role: 2,
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}eval2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        try { const result = await eval(args.join(' ')); reply(`✅ ${typeof result === 'string' ? result : JSON.stringify(result, null, 2)}`); } catch(e) { reply(`❌ ${e.message}`); }
    },
};
