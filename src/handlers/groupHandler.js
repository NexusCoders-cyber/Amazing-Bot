import logger from '../utils/logger.js';
import { getGroup, createGroup, updateGroup } from '../models/Group.js';

class GroupHandler {
    constructor() {
        this.groupStats = {
            totalGroups: 0,
            participantsUpdates: 0,
            groupUpdates: 0
        };
    }

    async handleParticipantsUpdate(sock, update) {
        try {
            const { id: groupId, participants, action } = update;

            logger.info(`Group participants update: ${groupId}, action: ${action}, participants: ${participants.length}`);

            this.groupStats.participantsUpdates++;

            // Basic handling - you can extend this
            for (const participant of participants) {
                switch (action) {
                    case 'add':
                        logger.info(`User ${participant} joined group ${groupId}`);
                        break;
                    case 'remove':
                    case 'leave':
                        logger.info(`User ${participant} left group ${groupId}`);
                        break;
                    case 'promote':
                        logger.info(`User ${participant} promoted in group ${groupId}`);
                        break;
                    case 'demote':
                        logger.info(`User ${participant} demoted in group ${groupId}`);
                        break;
                }
            }

            // Update group stats
            const group = await getGroup(groupId);
            if (group) {
                const metadata = await sock.groupMetadata(groupId);
                await updateGroup(groupId, {
                    participants: metadata.participants.length,
                    lastActivity: new Date()
                });
            }

        } catch (error) {
            logger.error('Group participants update error:', error);
        }
    }

    async handleGroupUpdate(sock, update) {
        try {
            const { id: groupId, subject, desc, announce, restrict } = update;

            logger.info(`Group update: ${groupId}`);

            this.groupStats.groupUpdates++;

            const updateData = {};

            if (subject !== undefined) {
                updateData.name = subject;
                logger.info(`Group name updated: ${groupId} -> ${subject}`);
            }

            if (desc !== undefined) {
                updateData.description = desc;
                logger.info(`Group description updated: ${groupId}`);
            }

            if (announce !== undefined) {
                updateData.announceMode = announce;
            }

            if (restrict !== undefined) {
                updateData.restrictMode = restrict;
            }

            if (Object.keys(updateData).length > 0) {
                await updateGroup(groupId, updateData);
            }

        } catch (error) {
            logger.error('Group update error:', error);
        }
    }

    getGroupStats() {
        return this.groupStats;
    }
}

const groupHandler = new GroupHandler();

export default {
    groupHandler,
    handleParticipantsUpdate: (sock, update) => groupHandler.handleParticipantsUpdate(sock, update),
    handleGroupUpdate: (sock, update) => groupHandler.handleGroupUpdate(sock, update),
    getGroupStats: () => groupHandler.getGroupStats()
};