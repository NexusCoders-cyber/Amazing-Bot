export default {
    config: {
        name: 'setwelcome',
        aliases: ['welcome'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Set welcome message',
        category: 'admin',
        coolDown: 10,
        role: 1,
        groupOnly: true,
        guide: { en: '{prefix}setwelcome <message>\n\nVariables:\n@user - mentions the user\n@group - group name\n@desc - group description' },
    },

    async onStart({ args, reply, isGroup, isGroupAdmin, isOwner, prefix, React }) {
        React('👋');
        if (!isGroup) return reply(`Group only command!`);
        if (!isGroupAdmin && !isOwner) return reply(`❌ Admin only!`);

        if (!args.length) return reply(`Set a welcome message.\nUsage: ${prefix}setwelcome <message>\n\nVariables: @user, @group, @desc`);

        const text = args.join(' ');
        reply([
            `━━━━━━━━━━━━━━━━━━━━`,
            `  👋 *WELCOME MESSAGE SET*`,
            `━━━━━━━━━━━━━━━━━━━━`,
            ``,
            `  ${text}`,
            ``,
            `  Variables: @user, @group, @desc`,
            `━━━━━━━━━━━━━━━━━━━━`,
        ].join('\n'));
    },
};
