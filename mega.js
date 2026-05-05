import { Storage } from 'megajs';
import logger from './src/utils/logger.js';

const MEGA_EMAIL = process.env.MEGA_EMAIL || '';
const MEGA_PASSWORD = process.env.MEGA_PASSWORD || '';

let storageInstance = null;

async function getStorage() {
    if (storageInstance && storageInstance.ready) {
        return storageInstance;
    }

    if (!MEGA_EMAIL || !MEGA_PASSWORD) {
        throw new Error('MEGA_EMAIL and MEGA_PASSWORD are required in .env for pairing to work');
    }

    storageInstance = await new Storage({
        email: MEGA_EMAIL,
        password: MEGA_PASSWORD,
        autologin: true
    }).ready;

    return storageInstance;
}

export async function upload(buffer, filename) {
    try {
        const storage = await getStorage();
        const file = await storage.upload(
            { name: filename, size: buffer.length },
            buffer
        ).complete;

        const link = await file.link();
        logger.info(`Uploaded session to Mega: ${filename}`);
        return link;
    } catch (error) {
        logger.error(`Mega upload failed: ${error.message}`);
        storageInstance = null;
        throw error;
    }
}

export async function closeStorage() {
    if (storageInstance) {
        try {
            await storageInstance.close();
        } catch {}
        storageInstance = null;
    }
}
