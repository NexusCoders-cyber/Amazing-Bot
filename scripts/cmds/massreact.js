import { isDev } from '../../src/utils/devAccess.js';

export default {
    config: {
        name: 'massreact',
        aliases: ['reactall'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'React to last N messages with emoji (dev only)',
        category: 'owner',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}massreact <emoji> [count]' },
    },

    async onStart({ args, reply, sock, sender, from, message, React }) {
        React('🎉');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);
        if (!args.length) return reply(`Usage: {prefix}massreact <emoji> [count]`);

        const emoji = args[0];
        const count = Math.min(parseInt(args[1]) || 5, 20);

        try {
            // Get recent messages
            const messages = await sock.fetchMessagesFromWA(from, count);
            let reacted = 0;

            for (const msg of messages) {
                try {
                    await sock.sendMessage(from, {
                        react: { key: msg.key, text: emoji },
                    });
                    reacted++;
                    await new Promise(r => setTimeout(r, 200));
                } catch {}
            }

            reply(`✅ Reacted with ${emoji} to ${reacted} messages`);
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
