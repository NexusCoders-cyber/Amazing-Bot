import { getSessionControl, updateSessionControl } from '../../src/utils/sessionControl.js';

export default {
    config: {
        name: 'mode',
        aliases: ['botmode'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Switch bot between public and private mode',
        category: 'owner',
        coolDown: 5,
        role: 2,
        guide: { en: '{prefix}mode public|private' },
    },
    async onStart({ sock, args, reply }) {
        const session = await getSessionControl(sock);
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'public') {
            await updateSessionControl(sock, { publicMode: true });
            return reply('Bot switched to public mode. Anyone can use commands.');
        }
        if (sub === 'private') {
            await updateSessionControl(sock, { publicMode: false });
            return reply('Bot switched to private mode. Only the owner can use commands.');
        }
        reply(`Current mode: ${session.publicMode ? 'public' : 'private'}\nUsage: mode public | mode private`);
    },
};
