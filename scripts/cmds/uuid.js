import crypto from 'crypto';

export default {
    config: {
        name: 'uuid',
        aliases: ['uid', 'generateuid'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Generate UUIDs',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}uuid [count]' },
    },
    async onStart({ args, reply }) {
        const count = Math.min(parseInt(args[0]) || 1, 10);
        const uuids = Array.from({ length: count }, () => crypto.randomUUID());
        reply(`🆔 *UUID${count > 1 ? 's' : ''}*\n\n${uuids.join('\n')}`);
    },
};
