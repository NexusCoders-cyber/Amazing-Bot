import logger from '../utils/logger.js';
import config from '../config.js';
import { getUser, updateUser } from '../models/User.js';

class CallHandler {
    constructor() {
        this.callStats = new Map();
        this.autoReject = true;
    }

    async handleIncomingCall(sock, callEvents) {
        if (!config.events.callAutoReject) return;

        for (const call of callEvents) {
            try {
                const { from, id, status, isVideo, isGroup } = call;
                if (status !== 'offer') continue;

                logger.info(`Incoming ${isVideo ? 'video' : 'voice'} call from ${from}`);

                const isOwner = config.ownerNumbers.some(num =>
                    from.includes(num.replace(/[^0-9]/g, ''))
                );

                if (isOwner) continue;

                if (this.autoReject && config.events.callAutoReject) {
                    await sock.rejectCall(id, from);

                    await sock.sendMessage(from, {
                        text: `${config.botName} does not accept calls.\n\nSend a text message instead.\nType ${config.prefix}help for assistance.`
                    });

                    logger.info(`Call from ${from} rejected`);

                    const user = await getUser(from);
                    if (user) await updateUser(from, { $inc: { callsRejected: 1 } });

                    for (const ownerNumber of config.ownerNumbers) {
                        await sock.sendMessage(ownerNumber, {
                            text: `Call rejected from @${from.split('@')[0]}\nType: ${isVideo ? 'Video' : 'Voice'}\nGroup: ${isGroup ? 'Yes' : 'No'}`,
                            mentions: [from]
                        });
                    }
                }

                this.updateCallStats(from, isVideo);

            } catch (error) {
                logger.error('Error handling call:', error);
            }
        }
    }

    updateCallStats(from, isVideo) {
        const stats = this.callStats.get(from) || { total: 0, video: 0, voice: 0 };
        stats.total++;
        isVideo ? stats.video++ : stats.voice++;
        this.callStats.set(from, stats);
    }

    setAutoReject(enabled) {
        this.autoReject = enabled;
        logger.info(`Auto-reject calls: ${enabled ? 'enabled' : 'disabled'}`);
    }

    getCallStats(from = null) {
        if (from) return this.callStats.get(from) || { total: 0, video: 0, voice: 0 };
        let totalCalls = 0, videoCalls = 0, voiceCalls = 0;
        for (const stats of this.callStats.values()) {
            totalCalls += stats.total;
            videoCalls += stats.video;
            voiceCalls += stats.voice;
        }
        return { total: totalCalls, video: videoCalls, voice: voiceCalls, uniqueCallers: this.callStats.size };
    }
}

export default new CallHandler();
