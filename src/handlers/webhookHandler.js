import logger from '../utils/logger.js';

class WebhookHandler {
    constructor() {
        this.webhookStats = {
            received: 0,
            processed: 0,
            errors: 0
        };
    }

    async handleWebhook(req, res) {
        try {
            this.webhookStats.received++;

            const { type, data } = req.body;

            logger.info(`Webhook received: ${type}`);

            // Basic webhook handling - you can extend this
            switch (type) {
                case 'message':
                    await this.handleMessageWebhook(data);
                    break;
                case 'status':
                    await this.handleStatusWebhook(data);
                    break;
                default:
                    logger.warn(`Unknown webhook type: ${type}`);
                    break;
            }

            this.webhookStats.processed++;

            res.json({ success: true, message: 'Webhook processed' });

        } catch (error) {
            this.webhookStats.errors++;
            logger.error('Webhook handling error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async handleMessageWebhook(data) {
        logger.info('Processing message webhook:', data);
        // Implement message webhook logic
    }

    async handleStatusWebhook(data) {
        logger.info('Processing status webhook:', data);
        // Implement status webhook logic
    }

    getWebhookStats() {
        return this.webhookStats;
    }
}

const webhookHandler = new WebhookHandler();

export default {
    webhookHandler,
    handleWebhook: (req, res) => webhookHandler.handleWebhook(req, res),
    getWebhookStats: () => webhookHandler.getWebhookStats()
};