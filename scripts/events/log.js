import { createPromoteImage, createDemoteImage } from '../../src/utils/canvasUtils.js';
import { normNum } from '../../src/utils/adminUtils.js';

export default {
    config: {
        name: 'log',
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Announces admin promotions, demotions, and group setting changes',
        category: 'events',
        role: 0,
    },

    async onStart({ sock, from, participants, action, author, metadata, changes }) {
        const groupName = metadata?.subject || 'the group';
        const authorName = author ? normNum(author) : 'Admin';

        if (action === 'promote' || action === 'demote') {
            const isPromote = action === 'promote';
            for (const participant of participants) {
                const userName = normNum(participant);
                const mentions = [participant, author].filter(Boolean);
                const text = isPromote
                    ? `@${userName} has been promoted to admin.\nPromoted by: @${authorName}`
                    : `@${userName} has been demoted to member.\nDemoted by: @${authorName}`;
                try {
                    const image = isPromote
                        ? await createPromoteImage(userName, groupName, authorName)
                        : await createDemoteImage(userName, groupName, authorName);
                    if (image) {
                        await sock.sendMessage(from, { image, caption: text, mentions });
                    } else {
                        await sock.sendMessage(from, { text, mentions });
                    }
                } catch (err) {
                    await sock.sendMessage(from, { text, mentions }).catch(() => {});
                }
            }
            return;
        }

        if (action === 'subject') {
            await sock.sendMessage(from, {
                text: `Group name changed to: ${changes?.subject}\nChanged by: @${authorName}`,
                mentions: author ? [author] : []
            });
            return;
        }

        if (action === 'desc') {
            await sock.sendMessage(from, {
                text: `Group description updated by: @${authorName}\n\n${changes?.desc || 'No description'}`,
                mentions: author ? [author] : []
            });
            return;
        }

        if (action === 'announce') {
            await sock.sendMessage(from, {
                text: `Only admins can send messages is now ${changes?.announce ? 'enabled' : 'disabled'}.\nChanged by: @${authorName}`,
                mentions: author ? [author] : []
            });
            return;
        }

        if (action === 'restrict') {
            await sock.sendMessage(from, {
                text: `Only admins can edit group info is now ${changes?.restrict ? 'enabled' : 'disabled'}.\nChanged by: @${authorName}`,
                mentions: author ? [author] : []
            });
        }
    },
};
