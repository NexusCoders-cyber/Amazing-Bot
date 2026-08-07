import { updateSessionControl } from '../../src/utils/sessionControl.js';

export default {
    config: {
        name: 'prefix',
        aliases: ['setprefix'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Change the bot command prefix',
        category: 'owner',
        coolDown: 5,
        role: 2,
        guide: { en: '{prefix}prefix <new_prefix>' },
    },
    async onStart({ sock, args, reply, prefix }) {
        if (!args[0]) return reply(`Current prefix: ${prefix}\nUsage: prefix <new_prefix>`);
        const newPrefix = args[0].trim().slice(0, 5);
        if (!newPrefix) return reply('Invalid prefix.');
        try {
            await updateSessionControl(sock, { prefix: newPrefix });
            reply(`Prefix changed from ${prefix} to ${newPrefix}`);
        } catch {
            reply(`Could not save. Prefix attempted: ${newPrefix}`);
        }
    },
};
