import { globalBan, globalUnban, isGlobalBanned, groupBan, groupUnban, isGroupBanned } from '../../src/commands/admin/ban.js';

export default {
    config: {
        name: 'ban',
        aliases: ['gban', 'banuser'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Ban or unban users globally or from the group',
        category: 'admin',
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}ban @user | ban unban @user | ban group @user' },
    },

    async onStart({ message, args, from, reply, isGroup }) {
        const ctx = message.message?.extendedTextMessage?.contextInfo;
        const mentions = ctx?.mentionedJid || [];
        const target = ctx?.participant || mentions[0];
        const sub = (args[0] || '').toLowerCase();

        if (!target) return reply('Reply to a message or mention someone.');

        const id = target.split('@')[0].split(':')[0];

        if (sub === 'unban') {
            globalUnban(target);
            if (isGroup) groupUnban(from, target);
            return reply(`@${id} has been unbanned.`);
        }

        if (sub === 'group' && isGroup) {
            if (isGroupBanned(from, target)) return reply(`@${id} is already group-banned.`);
            groupBan(from, target);
            return reply(`@${id} is banned from this group.`);
        }

        if (isGlobalBanned(id)) return reply(`@${id} is already globally banned.`);
        globalBan(target);
        reply(`@${id} has been globally banned from the bot.`);
    },
};
