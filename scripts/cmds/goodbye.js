export default {
    config: {
        name: 'goodbye',
        aliases: ['setgoodbye'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Set goodbye message',
        category: 'admin',
        coolDown: 10,
        role: 1,
        groupOnly: true,
        guide: { en: '{prefix}goodbye <message>\n\nVariables:\n@user - mentions the user\n@group - group name' },
    },

    async onStart({ args, reply, isGroup, isGroupAdmin, isOwner, prefix, React }) {
        React('👋');
        if (!isGroup) return reply(`Group only command!`);
        if (!isGroupAdmin && !isOwner) return reply(`❌ Admin only!`);

        if (!args.length) return reply(`Set a goodbye message.\nUsage: ${prefix}goodbye <message>\n\nVariables: @user, @group`);

        const text = args.join(' ');
        reply([
            `━━━━━━━━━━━━━━━━━━━━`,
            `  👋 *GOODBYE MESSAGE SET*`,
            `━━━━━━━━━━━━━━━━━━━━`,
            ``,
            `  ${text}`,
            ``,
            `  Variables: @user, @group`,
            `━━━━━━━━━━━━━━━━━━━━`,
        ].join('\n'));
    },
};
