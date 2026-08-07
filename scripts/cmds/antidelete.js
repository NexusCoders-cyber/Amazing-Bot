export default {
    config: {
        name: 'antidelete',
        aliases: ['ad'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Toggle anti-delete protection',
        category: 'admin',
        coolDown: 5,
        role: 1,
        groupOnly: true,
        guide: { en: '{prefix}antidelete on|off' },
    },

    async onStart({ args, reply, isGroup, isGroupAdmin, isOwner, prefix, React }) {
        React('🛡️');
        if (!isGroup) return reply(`Group only command!`);
        if (!isGroupAdmin && !isOwner) return reply(`❌ Admin only!`);

        const state = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(state)) {
            return reply(`Usage: ${prefix}antidelete on|off`);
        }

        reply([
            `━━━━━━━━━━━━━━━━━━━━`,
            `  🛡️ *ANTI-DELETE*`,
            `━━━━━━━━━━━━━━━━━━━━`,
            ``,
            `  Status: ${state === 'on' ? '✅ Enabled' : '❌ Disabled'}`,
            `  ${state === 'on' ? 'Deleted messages will be logged.' : 'Anti-delete is off.'}`,
            ``,
            `━━━━━━━━━━━━━━━━━━━━`,
        ].join('\n'));
    },
};
