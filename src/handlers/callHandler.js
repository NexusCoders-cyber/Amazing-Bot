import logger from '../utils/logger.js';

class CallHandler {
    constructor() {
        this.callStats = {
            totalCalls: 0,
            rejectedCalls: 0,
            acceptedCalls: 0
        };
    }

    async handleIncomingCall(sock, callEvents) {
        try {
            for (const call of callEvents) {
                logger.info(`Incoming call from ${call.from}: ${call.status}`);

                this.callStats.totalCalls++;

                // Auto reject calls if configured
                if (process.env.AUTO_REJECT_CALLS === 'true') {
                    await sock.rejectCall(call.id, call.from);
                    this.callStats.rejectedCalls++;
                    logger.info(`Auto-rejected call from ${call.from}`);
                } else {
                    // Send a message about the call
                    await sock.sendMessage(call.from, {
                        text: `📞 *Incoming Call*\n\nYou called the bot. The bot doesn't accept voice calls.\n\nPlease send a text message instead.`
                    });
                }
            }
        } catch (error) {
            logger.error('Call handling error:', error);
        }
    }

    getCallStats() {
        return this.callStats;
    }
}

const callHandler = new CallHandler();

export default {
    callHandler,
    handleIncomingCall: (sock, callEvents) => callHandler.handleIncomingCall(sock, callEvents),
    getCallStats: () => callHandler.getCallStats()
};