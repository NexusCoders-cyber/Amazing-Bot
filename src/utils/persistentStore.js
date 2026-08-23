import mongoose from 'mongoose';
import Settings from '../models/Settings.js';
import logger from './logger.js';

export function isDatabaseConnected() {
    return mongoose.connection.readyState === 1 && !mongoose.connection.simulated;
}

export async function loadBlob(key) {
    if (!isDatabaseConnected()) return null;
    try {
        const doc = await Settings.findOne({ key }).maxTimeMS(5000).lean();
        return doc ? doc.value : null;
    } catch (err) {
        logger.warn(`[persistentStore] Failed to load "${key}" from MongoDB: ${err.message}`);
        return null;
    }
}

export async function saveBlob(key, value) {
    if (!isDatabaseConnected()) return false;
    try {
        await Settings.findOneAndUpdate(
            { key },
            { key, value, type: 'object', category: 'store' },
            { upsert: true, maxTimeMS: 5000 }
        );
        return true;
    } catch (err) {
        logger.warn(`[persistentStore] Failed to save "${key}" to MongoDB: ${err.message}`);
        return false;
    }
}
