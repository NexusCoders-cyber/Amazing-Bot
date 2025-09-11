import logger from '../utils/logger.js';

class ErrorHandler {
    constructor() {
        this.errorStats = {
            unhandledRejections: 0,
            uncaughtExceptions: 0,
            otherErrors: 0
        };
    }

    async handleError(type, error) {
        try {
            logger.error(`Error type: ${type}`, error);

            switch (type) {
                case 'unhandledRejection':
                    this.errorStats.unhandledRejections++;
                    logger.error('Unhandled Promise Rejection:', error);
                    break;
                case 'uncaughtException':
                    this.errorStats.uncaughtExceptions++;
                    logger.error('Uncaught Exception:', error);
                    // For uncaught exceptions, we should exit
                    process.exit(1);
                    break;
                default:
                    this.errorStats.otherErrors++;
                    logger.error(`Unknown error type: ${type}`, error);
                    break;
            }

            // You can add notification logic here
            // e.g., send error report to owner

        } catch (handlingError) {
            console.error('Error in error handler:', handlingError);
        }
    }

    getErrorStats() {
        return this.errorStats;
    }
}

const errorHandler = new ErrorHandler();

export default {
    errorHandler,
    handleError: (type, error) => errorHandler.handleError(type, error),
    getErrorStats: () => errorHandler.getErrorStats()
};