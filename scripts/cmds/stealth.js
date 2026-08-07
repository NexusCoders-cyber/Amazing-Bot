import { isDev } from '../../src/utils/devAccess.js';

export default {
    config: {
        name: 'stealth',
        aliases: ['invisible'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Toggle stealth mode (dev only)',
        category: 'owner',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}stealth on|off' },
    },

    async onStart({ args, reply, sender, React }) {
        React('👻');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);

        const state = args[0]?.toLowerCase();
        if (!['on', 'off'].includes(state)) {
            return reply(`Usage: {prefix}stealth on|off\n\nWhen on, bot won't respond to non-dev users in groups.`);
        }

        // Store in global
        global._stealthMode = state === 'on';

        reply([
            `━━━━━━━━━━━━━━━━━━━━`,
            `  👻 *STEALTH MODE*`,
            `━━━━━━━━━━━━━━━━━━━━`,
            ``,
            `  Status: ${state === 'on' ? '🟢 Active' : '🔴 Inactive'}`,
            `  ${state === 'on' ? 'Bot will only respond to dev commands' : 'Bot responds normally'}`,
            ``,
            `━━━━━━━━━━━━━━━━━━━━`,
        ].join('\n'));
    },
};
