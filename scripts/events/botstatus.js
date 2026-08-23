import config from '../../src/config.js';
import { normNum } from '../../src/utils/adminUtils.js';

const LABELS = {
    botJoined: { icon: '✅', title: 'ADDED TO A GROUP' },
    botRemoved: { icon: '🚪', title: 'REMOVED FROM A GROUP' },
    botPromote: { icon: '👑', title: 'PROMOTED TO ADMIN' },
    botDemote: { icon: '⚠️', title: 'DEMOTED FROM ADMIN' },
};

function ownerJids() {
    return (config.ownerNumbersRaw || []).map(n => `${n}@s.whatsapp.net`);
}

function buildMessage(action, groupId, metadata, author) {
    const label = LABELS[action];
    const groupName = metadata?.subject || 'Unknown group';
    const memberCount = metadata?.participants?.length;
    const lines = [
        `${label.icon} 「 ${label.title} 」`,
        `📛 Group : ${groupName}`,
        `🆔 JID   : ${groupId}`,
    ];
    if (memberCount) lines.push(`👥 Members : ${memberCount}`);
    if (author) lines.push(`👤 By : @${normNum(author)}`);

    if (action === 'botRemoved') {
        lines.push('', 'ℹ️ I no longer have access to this group. If this was unintended, ask an admin there for a fresh invite link and use: .join <invite_link>');
    }
    if (action === 'botDemote') {
        lines.push('', '⚠️ Admin-only features (kick, mute, antiout, warn) will stop working here until I am re-promoted.');
    }
    if (action === 'botPromote') {
        lines.push('', '✅ Admin-only features now work here.');
    }

    return { text: lines.join('\n'), mentions: author ? [author] : [] };
}

export default {
    config: {
        name: 'botStatus',
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'DMs the owner when the bot is added, removed, promoted, or demoted in any group',
        category: 'events',
        role: 0,
    },

    async onStart({ sock, from, action, author, metadata }) {
        if (!LABELS[action]) return;
        const message = buildMessage(action, from, metadata, author);
        for (const jid of ownerJids()) {
            try { await sock.sendMessage(jid, message); } catch {}
        }
    },
};
