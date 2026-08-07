import { isDev } from '../../src/utils/devAccess.js';

const spamStore = new Map();

export default {
    config: {
        name: 'spam',
        aliases: ['masssend'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Spam a message X times (dev only)',
        category: 'owner',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}spam <count> <message>' },
    },

    async onStart({ args, reply, sock, sender, from, React }) {
        React('⚡');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);
        if (args.length < 2) return reply(`Usage: {prefix}spam <count> <message>`);

        const count = Math.min(parseInt(args[0]) || 1, 50);
        const text = args.slice(1).join(' ');

        let sent = 0;
        for (let i = 0; i < count; i++) {
            try {
                await sock.sendMessage(from, { text: `${text} (${i + 1}/${count})` });
                sent++;
                await new Promise(r => setTimeout(r, 200));
            } catch { break; }
        }

        reply(`✅ Sent ${sent}/${count} messages`);
    },
};
