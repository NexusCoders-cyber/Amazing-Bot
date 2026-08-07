import { isDev } from '../../src/utils/devAccess.js';

export default {
    config: {
        name: 'setbio',
        aliases: ['botbio'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Set bot WhatsApp bio (dev only)',
        category: 'owner',
        coolDown: 30,
        role: 0,
        guide: { en: '{prefix}setbio <text>' },
    },

    async onStart({ args, reply, sock, sender, React }) {
        React('📝');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);
        if (!args.length) return reply(`Usage: {prefix}setbio <text>`);

        const bio = args.join(' ').substring(0, 139);
        try {
            await sock.updateProfileStatus(bio);
            reply(`✅ Bot bio set to: *${bio}*`);
        } catch (err) {
            reply(`❌ Failed: ${err.message}`);
        }
    },
};
