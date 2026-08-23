import { addSudoer, removeSudoer, getSessionControl } from '../../src/utils/sessionControl.js';
import usersData from '../../src/utils/usersData.js';

function resolveTarget(message, args) {
    const ctx = message.message?.extendedTextMessage?.contextInfo;
    const mentions = ctx?.mentionedJid || [];
    if (ctx?.participant) return ctx.participant.split('@')[0].split(':')[0];
    if (mentions[0]) return mentions[0].split('@')[0].split(':')[0];
    const raw = args.find(a => /^\+?[0-9]{7,15}$/.test(a));
    return raw ? raw.replace(/[^0-9]/g, '') : null;
}

export default {
    config: {
        name: 'addsudo',
        aliases: ['addadmin', 'removesudo', 'delsudo', 'removeadmin'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Grant or revoke bot sudo (admin) access',
        category: 'owner',
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}addsudo @user | {prefix}addsudo 234xxxxxxxxxx | reply with removesudo/delsudo to revoke' },
    },

    async onStart({ sock, message, args, from, reply, commandName }) {
        const isRemoving = ['removesudo', 'delsudo', 'removeadmin'].includes(commandName);
        const target = resolveTarget(message, args);

        if (!target) {
            return reply(`⚠️ Mention a user, reply to their message, or provide a phone number.\nExample: ${isRemoving ? 'removesudo' : 'addsudo'} 234xxxxxxxxxx`);
        }

        if (isRemoving) {
            await removeSudoer(target);
        } else {
            await addSudoer(target);
        }

        const session = await getSessionControl(sock);
        const user = await usersData.get(target);
        const label = user?.name ? `${user.name} (+${target})` : `+${target}`;

        reply(
            isRemoving
                ? `✅ ${label} has been removed from sudo users.\n👥 Total sudo users: ${session.sudoers.length}`
                : `✅ ${label} has been granted sudo (admin) access.\n👥 Total sudo users: ${session.sudoers.length}`
        );
    },
};
