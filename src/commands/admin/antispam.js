import antiSpamModule from '../../utils/antiSpam.js';

const { antiSpam, processSpamAction } = antiSpamModule;

export async function checkSpam(sock, message) {
    const from = message?.key?.remoteJid;
    if (!from?.endsWith('@g.us')) return false;
    const sender = message?.key?.participant;
    if (!sender || !antiSpam) return false;

    const msg = message?.message;
    const text = msg?.conversation || msg?.extendedTextMessage?.text || '';

    try {
        const result = antiSpam.checkSpam(sender, text, { groupId: from, isGroup: true });
        if (!result?.isSpam) return false;
        if (processSpamAction) await processSpamAction(sock, message, result, { groupId: from });
        return true;
    } catch { return false; }
}

export default {
    config: {
        name: 'antispam',
        aliases: ['nospam', 'spam'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Anti-spam protection for groups',
        category: 'admin',
        coolDown: 3,
        role: 1,
        guide: { en: '{prefix}antispam stats' },
    },
    async onStart({ args, from, reply, isGroup, isGroupAdmin }) {
        if (!isGroup) return reply('Group only.');
        if (!isGroupAdmin) return reply('Admin only.');
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'stats') {
            const stats = antiSpam?.getGlobalStats?.() || {};
            return reply(`Violations: ${stats.totalViolations || 0}\nActive: ${stats.activeUsers || 0}`);
        }
        reply('Antispam is active.\nUse: antispam stats to view violations.');
    },
};
