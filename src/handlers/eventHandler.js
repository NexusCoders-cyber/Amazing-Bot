import logger from '../utils/logger.js';

class EventHandler {
    constructor() {
        this.eventStats = {
            contactUpdates: 0,
            otherEvents: 0
        };
    }

    async handleContactUpdate(sock, contactUpdates) {
        try {
            logger.info(`Contact updates: ${contactUpdates.length}`);

            this.eventStats.contactUpdates += contactUpdates.length;

            for (const update of contactUpdates) {
                const { jid, name, notify } = update;

                if (name || notify) {
                    logger.info(`Contact updated: ${jid} - ${name || notify}`);
                }
            }

        } catch (error) {
            logger.error('Contact update handling error:', error);
        }
    }

    getEventStats() {
        return this.eventStats;
    }
}

const eventHandler = new EventHandler();

export default {
    eventHandler,
    handleContactUpdate: (sock, updates) => eventHandler.handleContactUpdate(sock, updates),
    getEventStats: () => eventHandler.getEventStats()
};