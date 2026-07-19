import logger from '../utils/logger.js';
import config from '../config.js';
import { getUser, updateUser } from '../models/User.js';

class CallHandler {
    constructor() {
        this.callStats = new Map();
        this.autoReject = true;
    }

    async handleIncomingCall(sock, callEvents) {
        if (!config.events?.callAutoReject) return;

        for (const call of callEvents) {
            try {
                const { from, id, status, isVideo, isGroup } = call;
                if (status !== 'offer') continue;

                logger.info(`Incoming ${isVideo ? 'video' : 'voice'} call from ${from}`);

                const fromPhone = String(from || '').replace(/[^0-9]/g, '');
                const isOwner = (config.ownerNumbers || []).some(n =>
                    String(n).replace(/[^0-9]/g, '') === fromPhone
                );

                if (isOwner) {
                    logger.info(`Call from owner ${from} — allowing`);
                    continue;
                }

                if (this.autoReject && config.events?.callAutoReject) {
                    await sock.rejectCall(id, from).catch(() => {});

                    const rejectMsg = [
                        `📵 *Auto Call Rejection*`,
                        ``,
                        `This bot does not accept calls.`,
                        `Please send a text message instead.`,
                        ``,
                        `Type *${config.prefix || '.'}help* for available commands.`
                    ].join('\n');

                    await sock.sendMessage(from, { text: rejectMsg }).catch(() => {});

                    logger.info(`Call from ${from} rejected`);

                    try {
                        const user = await getUser(from);
                        if (user) {
                            const current = typeof user.callsRejected === 'number' ? user.callsRejected : 0;
                            await updateUser(from, { callsRejected: current + 1 });
                        }
                    } catch {}

                    const ownerNums = config.ownerNumbers || [];
                    if (ownerNums.length > 0) {
                        const ownerAlert = [
                            `📞 *Incoming Call Blocked*`,
                            ``,
                            `👤 From: @${fromPhone}`,
                            `📹 Type: ${isVideo ? 'Video' : 'Voice'} Call`,
                            `👥 Group: ${isGroup ? 'Yes' : 'No'}`,
                            `🕐 Time: ${new Date().toLocaleString()}`,
                            `✅ Action: Auto-rejected`
                        ].join('\n');

                        for (const num of ownerNums) {
                            const ownerJid = String(num).replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                            await sock.sendMessage(ownerJid, { text: ownerAlert }).catch(() => {});
                        }
                    }

                    this.recordCallStat(from, isVideo ? 'video' : 'voice', 'rejected');
                }
            } catch (error) {
                logger.error('Error handling call:', error);
            }
        }
    }

    recordCallStat(from, type, action) {
        const key = `${from}_${type}`;
        const existing = this.callStats.get(key) || { count: 0, type, action };
        existing.count++;
        existing.lastAt = Date.now();
        this.callStats.set(key, existing);
    }

    getCallStats() {
        return {
            total: Array.from(this.callStats.values()).reduce((a, b) => a + b.count, 0),
            byType: {
                video: Array.from(this.callStats.values()).filter(s => s.type === 'video').reduce((a, b) => a + b.count, 0),
                voice: Array.from(this.callStats.values()).filter(s => s.type === 'voice').reduce((a, b) => a + b.count, 0)
            }
        };
    }
}

export default new CallHandler();
