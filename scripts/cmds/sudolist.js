import { getSessionControl } from '../../src/utils/sessionControl.js';
import usersData from '../../src/utils/usersData.js';

export default {
    config: {
        name: 'sudolist',
        aliases: ['listsudo', 'sudos'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'List all current sudo users',
        category: 'owner',
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}sudolist' },
    },

    async onStart({ sock, reply }) {
        const session = await getSessionControl(sock);
        const sudoers = session.sudoers || [];

        if (!sudoers.length) return reply('📭 No sudo users yet.\n\nUse *addsudo @user* to add one.');

        const rows = await Promise.all(sudoers.map(async (num, i) => {
            const user = await usersData.get(num);
            const name = user?.name ? user.name : null;
            return name ? `${i + 1}. ${name} (+${num})` : `${i + 1}. +${num}`;
        }));

        reply(`👥 *Sudo Users (${sudoers.length})*\n\n${rows.join('\n')}`);
    },
};
