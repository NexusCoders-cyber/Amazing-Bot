export default {
    config: {
        name: 'setname',
        aliases: ['botname'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Set bot name (owner only)',
        category: 'owner',
        coolDown: 10,
        role: 2,
        guide: { en: '{prefix}setname <name>' },
    },

    async onStart({ args, reply, isOwner, React }) {
        React('📝');
        if (!isOwner) return reply(`❌ Owner only!`);
        if (!args.length) return reply(`Usage: {prefix}setname <name>`);

        const name = args.join(' ');
        reply(`✅ Bot name set to: *${name}*\n⚠️ Note: Name changes require config update.`);
    },
};
