import logger from '../utils/logger.js';
import fs from 'fs-extra';
import path from 'path';

class MediaHandler {
    constructor() {
        this.mediaStats = {
            processed: 0,
            images: 0,
            videos: 0,
            audio: 0,
            documents: 0
        };
    }

    async processMedia(sock, message, mediaData, user, group) {
        try {
            logger.info(`Processing media: ${mediaData.mimetype} from ${user.jid}`);

            this.mediaStats.processed++;

            const mediaType = mediaData.mimetype?.split('/')[0];

            switch (mediaType) {
                case 'image':
                    this.mediaStats.images++;
                    await this.handleImage(sock, message, mediaData, user, group);
                    break;
                case 'video':
                    this.mediaStats.videos++;
                    await this.handleVideo(sock, message, mediaData, user, group);
                    break;
                case 'audio':
                    this.mediaStats.audio++;
                    await this.handleAudio(sock, message, mediaData, user, group);
                    break;
                default:
                    if (mediaData.mimetype?.includes('document')) {
                        this.mediaStats.documents++;
                        await this.handleDocument(sock, message, mediaData, user, group);
                    }
                    break;
            }

        } catch (error) {
            logger.error('Media processing error:', error);
        }
    }

    async processQuotedMedia(sock, message, mediaData, user) {
        try {
            logger.info(`Processing quoted media: ${mediaData.mimetype} from ${user.jid}`);

            // Similar processing but for quoted messages
            await this.processMedia(sock, message, mediaData, user, null);

        } catch (error) {
            logger.error('Quoted media processing error:', error);
        }
    }

    async handleImage(sock, message, mediaData, user, group) {
        // Basic image handling - you can add processing like stickers, etc.
        logger.info(`Image received: ${mediaData.fileName || 'unnamed'}`);
    }

    async handleVideo(sock, message, mediaData, user, group) {
        logger.info(`Video received: ${mediaData.fileName || 'unnamed'}`);
    }

    async handleAudio(sock, message, mediaData, user, group) {
        logger.info(`Audio received: ${mediaData.fileName || 'unnamed'}`);
    }

    async handleDocument(sock, message, mediaData, user, group) {
        logger.info(`Document received: ${mediaData.fileName || 'unnamed'}`);
    }

    getMediaStats() {
        return this.mediaStats;
    }
}

const mediaHandler = new MediaHandler();

export default {
    mediaHandler,
    processMedia: (sock, message, mediaData, user, group) => mediaHandler.processMedia(sock, message, mediaData, user, group),
    processQuotedMedia: (sock, message, mediaData, user) => mediaHandler.processQuotedMedia(sock, message, mediaData, user),
    getMediaStats: () => mediaHandler.getMediaStats()
};