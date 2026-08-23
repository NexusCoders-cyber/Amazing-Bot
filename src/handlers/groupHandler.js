import logger from '../utils/logger.js';
import config from '../config.js';
import commandHandler from './commandHandler.js';
import { normNum } from '../utils/adminUtils.js';
import { isAntiOutEnabled } from '../utils/antioutStore.js';
import { isAntiLeaveEnabled } from '../commands/admin/antileave.js';
import { isBanned, isGlobalBanned } from '../commands/admin/ban.js';

const antiOutLastAttempt = new Map();

function shouldThrottleReadd(groupId, participant) {
    const key = `${groupId}:${participant}`;
    const now = Date.now();
    const last = antiOutLastAttempt.get(key) || 0;
    if (now - last < 10 * 60 * 1000) return true;
    antiOutLastAttempt.set(key, now);
    return false;
}

function getBotJid(sock) {
    return sock?.user?.id?.split(':')[0] || '';
}

function splitBotParticipant(sock, participants) {
    const botJid = getBotJid(sock);
    if (!botJid) return { botIncluded: false, others: participants };
    const botIncluded = participants.some(p => String(p).split(':')[0] === botJid);
    const others = participants.filter(p => String(p).split(':')[0] !== botJid);
    return { botIncluded, others };
}

class GroupHandler {
    async handleParticipantsUpdate(sock, groupUpdate) {
        try {
            const { id, action } = groupUpdate;
            logger.info(`Group participants update: ${id} — Action: ${action}`);

            const botActionMap = { add: 'botJoined', remove: 'botRemoved', leave: 'botRemoved', promote: 'botPromote', demote: 'botDemote' };
            if (botActionMap[action]) {
                const { botIncluded, others } = splitBotParticipant(sock, groupUpdate.participants || []);
                if (botIncluded && config.events?.botStatusAlerts) {
                    await this.dispatchBotStatusEvent(sock, { ...groupUpdate, action: botActionMap[action] });
                }
                groupUpdate = { ...groupUpdate, participants: others };
                if (!others.length) return;
            }

            if (action === 'add') {
                await this.processJoin(sock, groupUpdate);
            } else if (action === 'remove' || action === 'leave') {
                if (config.events?.groupLeave) await this.dispatchEvent(sock, groupUpdate);
                await this.handleAntiOut(sock, groupUpdate);
            } else if (action === 'promote') {
                if (config.events?.groupPromote) await this.dispatchEvent(sock, groupUpdate);
            } else if (action === 'demote') {
                if (config.events?.groupDemote) await this.dispatchEvent(sock, groupUpdate);
            }
        } catch (error) {
            logger.error('Error handling participants update:', error);
        }
    }

    async dispatchBotStatusEvent(sock, groupUpdate) {
        const { id: groupId, action, author } = groupUpdate;
        const metadata = await sock.groupMetadata(groupId).catch(() => null);
        await commandHandler.handleEvent(sock, { from: groupId, participants: [], action, author, metadata });
    }

    async processJoin(sock, groupUpdate) {
        const { id: groupId, participants } = groupUpdate;
        const survivors = [];

        for (const participant of participants) {
            if (isGlobalBanned(participant) || await isBanned(groupId, participant)) {
                try {
                    await sock.groupParticipantsUpdate(groupId, [participant], 'remove');
                    await sock.sendMessage(groupId, {
                        text: `@${normNum(participant)} is banned from this group.`,
                        mentions: [participant]
                    });
                } catch (err) {
                    logger.error(`Failed to remove banned user ${participant}:`, err);
                }
                continue;
            }
            survivors.push(participant);
        }

        if (!survivors.length || !config.events?.groupJoin) return;
        await this.dispatchEvent(sock, { ...groupUpdate, participants: survivors });
    }

    async dispatchEvent(sock, groupUpdate) {
        const { id: groupId, participants, action, author } = groupUpdate;
        const metadata = await sock.groupMetadata(groupId).catch(() => null);
        await commandHandler.handleEvent(sock, { from: groupId, participants, action, author, metadata });
    }

    async handleAntiOut(sock, groupUpdate) {
        try {
            const { id: groupId, participants = [], action, author } = groupUpdate;
            if (!participants.length) return;

            const enabled = await isAntiOutEnabled(groupId);
            if (!enabled) {
                if (await isAntiLeaveEnabled(groupId)) {
                    for (const participant of participants) {
                        const isVoluntaryLeave = action === 'leave' || !author || author === participant;
                        if (!isVoluntaryLeave) continue;
                        await new Promise(r => setTimeout(r, 3000));
                        await sock.groupParticipantsUpdate(groupId, [participant], 'add').catch(() => {});
                    }
                }
                return;
            }

            const botJid = sock?.user?.id?.split(':')[0] || '';
            const meta = await sock.groupMetadata(groupId).catch(() => null);
            const botP = meta?.participants?.find((p) => String(p.id || '').split(':')[0] === botJid);
            if (!botP?.admin) return;

            for (const participant of participants) {
                const isVoluntaryLeave = action === 'leave' || !author || author === participant;
                if (!isVoluntaryLeave) continue;
                if (shouldThrottleReadd(groupId, participant)) continue;
                const waitMs = 3000 + Math.floor(Math.random() * 3000);
                await new Promise((resolve) => setTimeout(resolve, waitMs));
                await sock.groupParticipantsUpdate(groupId, [participant], 'add').catch(() => {});
            }
        } catch (error) {
            logger.debug(`Antiout handling skipped: ${error.message}`);
        }
    }

    async handleGroupUpdate(sock, groupsUpdate) {
        if (!config.events?.groupUpdate) return;
        try {
            for (const group of groupsUpdate) {
                logger.debug(`Group updated: ${group.id}`);
                const metadata = await sock.groupMetadata(group.id).catch(() => null);
                const author = group.author;
                const participants = author ? [author] : [];

                if (group.subject) {
                    await commandHandler.handleEvent(sock, {
                        from: group.id, participants, action: 'subject', author, metadata,
                        changes: { subject: group.subject }
                    });
                }
                if (group.desc !== undefined) {
                    await commandHandler.handleEvent(sock, {
                        from: group.id, participants, action: 'desc', author, metadata,
                        changes: { desc: group.desc }
                    });
                }
                if (group.announce !== undefined) {
                    await commandHandler.handleEvent(sock, {
                        from: group.id, participants, action: 'announce', author, metadata,
                        changes: { announce: group.announce }
                    });
                }
                if (group.restrict !== undefined) {
                    await commandHandler.handleEvent(sock, {
                        from: group.id, participants, action: 'restrict', author, metadata,
                        changes: { restrict: group.restrict }
                    });
                }
            }
        } catch (error) {
            logger.error('Error handling group update:', error);
        }
    }
}

export default new GroupHandler();
