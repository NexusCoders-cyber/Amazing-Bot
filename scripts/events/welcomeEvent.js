import { getWelcomeConfig } from '../cmds/welcome.js';
import { normNum } from '../../src/utils/adminUtils.js';

async function getProfilePic(sock, jid) {
    try { return await sock.profilePictureUrl(jid, 'image'); }
    catch { return null; }
}

function renderTemplate(template, mention, group, count) {
    return String(template || '')
        .replace(/\{name\}/gi, mention)
        .replace(/\{group\}/gi, group)
        .replace(/\{count\}/gi, String(count));
}

export default {
    config: {
        name: 'welcomeEvent',
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Sends welcome and goodbye messages using the settings from the welcome command',
        category: 'events',
        role: 0,
    },

    async onStart({ sock, from, participants, action, metadata }) {
        if (!metadata || !participants?.length) return;
        const cfg = getWelcomeConfig(from);
        const groupName = metadata.subject || 'the group';
        const count = metadata.participants?.length || 0;

        if (action === 'add') {
            if (!cfg.welcome?.enabled) return;
            for (const jid of participants) {
                const mention = `@${normNum(jid)}`;
                const text = renderTemplate(cfg.welcome.message, mention, groupName, count);
                const pic = await getProfilePic(sock, jid);
                if (pic) {
                    await sock.sendMessage(from, { image: { url: pic }, caption: text, mentions: [jid] });
                } else {
                    await sock.sendMessage(from, { text, mentions: [jid] });
                }
            }
        }

        if (action === 'remove' || action === 'leave') {
            if (!cfg.goodbye?.enabled) return;
            for (const jid of participants) {
                const mention = `@${normNum(jid)}`;
                const text = renderTemplate(cfg.goodbye.message, mention, groupName, count);
                await sock.sendMessage(from, { text, mentions: [jid] });
            }
        }
    },
};
