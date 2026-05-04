import logger from '../utils/logger.js';
import config from '../config.js';
import { getGroup, updateGroup } from '../models/Group.js';
import { createPromoteImage, createDemoteImage, createGroupUpdateImage } from '../utils/canvasUtils.js';

export default async function handleGroupUpdate(sock, update) {
    try {
        const groupId = update.id;
        const action = update.action;
        const participants = update.participants || [];
        const author = update.author;

        const group = await getGroup(groupId);
        if (!group) return;

        let groupMetadata;
        try {
            groupMetadata = await sock.groupMetadata(groupId);
        } catch {
            return;
        }

        const currentGroupName = groupMetadata.subject || 'Group';
        const currentGroupDesc = groupMetadata.desc || 'No description';

        if (action === 'promote' && participants.length > 0) {
            for (const participant of participants) {
                try {
                    const userName = participant.split('@')[0];
                    const authorName = author ? author.split('@')[0] : 'Admin';

                    const promoteImage = await createPromoteImage(userName, currentGroupName, authorName);

                    const promoteMessage = `╭──⦿【 👑 PROMOTION 】\n│\n│ 🎉 Congratulations @${userName}!\n│ ⬆️ You are now a Group Admin\n│ 👨‍💼 Promoted by: @${authorName}\n│ 💼 Use your power wisely!\n│\n╰────────────⦿`;

                    const mentions = [participant, author].filter(Boolean);

                    if (promoteImage) {
                        await sock.sendMessage(groupId, {
                            image: promoteImage,
                            caption: promoteMessage,
                            mentions
                        });
                    } else {
                        await sock.sendMessage(groupId, { text: promoteMessage, mentions });
                    }
                } catch (error) {
                    logger.error(`Error sending promote notification:`, error);
                }
            }
        }

        if (action === 'demote' && participants.length > 0) {
            for (const participant of participants) {
                try {
                    const userName = participant.split('@')[0];
                    const authorName = author ? author.split('@')[0] : 'Admin';

                    const demoteImage = await createDemoteImage(userName, currentGroupName, authorName);

                    const demoteMessage = `╭──⦿【 ⬇️ DEMOTION 】\n│\n│ 📉 @${userName} is no longer an admin\n│ 👮 Demoted by: @${authorName}\n│ 👤 Now a regular member\n│\n╰────────────⦿`;

                    const mentions = [participant, author].filter(Boolean);

                    if (demoteImage) {
                        await sock.sendMessage(groupId, {
                            image: demoteImage,
                            caption: demoteMessage,
                            mentions
                        });
                    } else {
                        await sock.sendMessage(groupId, { text: demoteMessage, mentions });
                    }
                } catch (error) {
                    logger.error(`Error sending demote notification:`, error);
                }
            }
        }

        if (update.subject) {
            try {
                const oldSubject = group.name || currentGroupName;
                const newSubject = update.subject;
                const authorName = author ? author.split('@')[0] : 'Admin';

                const updateImage = await createGroupUpdateImage('Name', oldSubject, newSubject, authorName);

                const updateMessage = `╭──⦿【 📝 GROUP NAME CHANGED 】\n│\n│ 🔄 Group name updated\n│ 📛 Old: ${oldSubject}\n│ 📛 New: ${newSubject}\n│ 👨‍💼 Changed by: @${authorName}\n│\n╰────────────⦿`;

                const mentions = author ? [author] : [];

                if (updateImage) {
                    await sock.sendMessage(groupId, {
                        image: updateImage,
                        caption: updateMessage,
                        mentions
                    });
                } else {
                    await sock.sendMessage(groupId, { text: updateMessage, mentions });
                }

                await updateGroup(groupId, {
                    name: newSubject,
                    $push: {
                        'history.nameChanges': {
                            oldName: oldSubject,
                            newName: newSubject,
                            changedBy: author,
                            changedAt: new Date()
                        }
                    }
                });
            } catch (error) {
                logger.error(`Error sending group name change notification:`, error);
            }
        }

        if (update.desc !== undefined) {
            try {
                const authorName = author ? author.split('@')[0] : 'Admin';
                const oldDesc = group.description || currentGroupDesc;
                const newDesc = update.desc || 'No description';

                const updateImage = await createGroupUpdateImage('Description',
                    oldDesc.length > 50 ? oldDesc.substring(0, 47) + '...' : oldDesc,
                    newDesc.length > 50 ? newDesc.substring(0, 47) + '...' : newDesc,
                    authorName);

                const updateMessage = `╭──⦿【 📝 DESCRIPTION CHANGED 】\n│\n│ 📋 Group description updated\n│ 👨‍💼 Changed by: @${authorName}\n│\n│ 📄 New Description:\n│ ${newDesc.slice(0, 200)}\n│\n╰────────────⦿`;

                const mentions = author ? [author] : [];

                if (updateImage) {
                    await sock.sendMessage(groupId, {
                        image: updateImage,
                        caption: updateMessage,
                        mentions
                    });
                } else {
                    await sock.sendMessage(groupId, { text: updateMessage, mentions });
                }

                await updateGroup(groupId, {
                    description: newDesc,
                    $push: {
                        'history.descChanges': {
                            oldDesc,
                            newDesc,
                            changedBy: author,
                            changedAt: new Date()
                        }
                    }
                });
            } catch (error) {
                logger.error(`Error sending group description change notification:`, error);
            }
        }

        if (update.announce !== undefined) {
            try {
                const authorName = author ? author.split('@')[0] : 'Admin';
                const announceStatus = update.announce ? 'enabled' : 'disabled';

                await sock.sendMessage(groupId, {
                    text: `╭──⦿【 📢 GROUP SETTINGS 】\n│\n│ 🔒 Send messages setting changed\n│ 📊 Status: Only admins can send messages is now ${announceStatus}\n│ 👨‍💼 Changed by: @${authorName}\n│\n╰────────────⦿`,
                    mentions: author ? [author] : []
                });
            } catch {}
        }

        if (update.restrict !== undefined) {
            try {
                const authorName = author ? author.split('@')[0] : 'Admin';
                const restrictStatus = update.restrict ? 'enabled' : 'disabled';

                await sock.sendMessage(groupId, {
                    text: `╭──⦿【 ⚙️ GROUP SETTINGS 】\n│\n│ 🔧 Edit group info setting changed\n│ 📊 Status: Only admins can edit info is now ${restrictStatus}\n│ 👨‍💼 Changed by: @${authorName}\n│\n╰────────────⦿`,
                    mentions: author ? [author] : []
                });
            } catch {}
        }

    } catch (error) {
        logger.error('Error in groupUpdate event:', error);
    }
}
