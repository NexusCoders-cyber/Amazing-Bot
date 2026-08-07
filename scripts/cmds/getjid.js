import { isDev } from '../../src/utils/devAccess.js';

export default {
    config: {
        name: 'getjid',
        aliases: ['jid'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get JID of replied user/group (dev only)',
        category: 'owner',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}getjid [@user]' },
    },

    async onStart({ message, args, reply, from, sender, isGroup, React }) {
        React('🆔');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);

        const mentioned = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
        const quoted = message?.message?.extendedTextMessage?.contextInfo?.participant;

        let jid = mentioned[0] || quoted || (isGroup ? from : sender);

        reply([
            `━━━━━━━━━━━━━━━━━━━━`,
            `  🆔 *JID INFO*`,
            `━━━━━━━━━━━━━━━━━━━━`,
            ``,
            `  JID: \`${jid}\``,
            `  Number: ${jid.split('@')[0].split(':')[0]}`,
            `  Type: ${jid.includes('@g.us') ? 'Group' : 'User'}`,
            ``,
            `━━━━━━━━━━━━━━━━━━━━`,
        ].join('\n'));
    },
};
