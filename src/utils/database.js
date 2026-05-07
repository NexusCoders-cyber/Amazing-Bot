import mongoose from 'mongoose';
import fs from 'fs-extra';
import path from 'path';
import config from '../config.js';
import logger from './logger.js';

class DatabaseManager {
    constructor() {
        this.connection = null;
        this.isConnected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 5000;
    }

    async connectToDatabase() {
        try {
            if (this.isConnected) {
                logger.info('Database already connected');
                return this.connection;
            }

            logger.info('Connecting to database...');

            const dbUrl = config.database?.url || '';

            const skipConditions = [
                !dbUrl,
                dbUrl === 'mongodb://localhost:27017/ilombot',
                dbUrl.includes('localhost'),
                dbUrl.length < 20,
                process.env.REPLIT_ENVIRONMENT,
                process.env.REPL_ID,
                process.env.NODE_ENV === 'development' && !process.env.MONGODB_URL
            ];

            if (skipConditions.some(Boolean)) {
                logger.info('Using simulated database (no valid MongoDB URL configured)');
                this.isConnected = true;
                mongoose.set('bufferCommands', false);
                mongoose.connection.simulated = true;
                return { readyState: 0, simulated: true };
            }

            const sanitized = dbUrl.replace(/\/\/([^:]+):([^@]+)@/, '//****:****@');
            logger.info(`Connecting to: ${sanitized}`);

            mongoose.set('strictQuery', false);

            const connectOptions = {
                maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
                serverSelectionTimeoutMS: parseInt(process.env.DB_TIMEOUT) || 5000,
                socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT) || 45000,
                bufferCommands: false,
                dbName: 'ilombot'
            };

            this.connection = await mongoose.connect(dbUrl, connectOptions);

            this.isConnected = true;
            this.reconnectAttempts = 0;

            logger.info('✅ Database connected successfully');
            this.setupEventListeners();
            await this.runMigrations();

            return this.connection;
        } catch (error) {
            logger.warn(`Database connection failed: ${error.message} — running without DB`);
            this.isConnected = true;
            mongoose.set('bufferCommands', false);
            mongoose.connection.simulated = true;
            return { readyState: 0, simulated: true };
        }
    }

    setupEventListeners() {
        mongoose.connection.on('connected', () => {
            this.isConnected = true;
            logger.info('Database connected');
        });

        mongoose.connection.on('error', (error) => {
            logger.error('Database error:', error.message);
            this.isConnected = false;
        });

        mongoose.connection.on('disconnected', () => {
            this.isConnected = false;
            logger.warn('Database disconnected');
            this.handleReconnection();
        });

        mongoose.connection.on('reconnected', () => {
            this.isConnected = true;
            this.reconnectAttempts = 0;
            logger.info('Database reconnected');
        });

        process.on('SIGINT', this.gracefulShutdown.bind(this));
        process.on('SIGTERM', this.gracefulShutdown.bind(this));
    }

    async handleReconnection() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            logger.error('Max reconnection attempts reached');
            return;
        }

        this.reconnectAttempts++;
        logger.info(`Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);

        setTimeout(async () => {
            try {
                const connectOptions = {
                    maxPoolSize: parseInt(process.env.DB_MAX_POOL_SIZE) || 10,
                    serverSelectionTimeoutMS: parseInt(process.env.DB_TIMEOUT) || 5000,
                    socketTimeoutMS: parseInt(process.env.DB_SOCKET_TIMEOUT) || 45000,
                    bufferCommands: false,
                    dbName: 'ilombot'
                };
                await mongoose.connect(config.database.url, connectOptions);
            } catch (error) {
                logger.error(`Reconnection failed: ${error.message}`);
                this.handleReconnection();
            }
        }, this.reconnectDelay * this.reconnectAttempts);
    }

    async gracefulShutdown() {
        logger.info('Closing database connection...');
        try {
            await mongoose.connection.close();
            logger.info('Database connection closed');
            process.exit(0);
        } catch {
            process.exit(1);
        }
    }

    async runMigrations() {
        try {
            if (mongoose.connection.readyState !== 1) return;

            const collections = await mongoose.connection.db.listCollections().toArray();
            const names = collections.map(c => c.name);

            const required = [
                'users', 'groups', 'messages', 'commands', 'economy',
                'games', 'warnings', 'bans', 'premium', 'settings', 'logs'
            ];

            for (const col of required) {
                if (!names.includes(col)) {
                    await mongoose.connection.db.createCollection(col);
                }
            }

            await this.createIndexes();
            logger.info('✅ Migrations completed');
        } catch (error) {
            logger.error('Migration failed:', error.message);
        }
    }

    async createIndexes() {
        try {
            if (mongoose.connection.readyState !== 1) return;
            const db = mongoose.connection.db;

            await db.collection('users').createIndex({ jid: 1 }, { unique: true, background: true });
            await db.collection('users').createIndex({ phone: 1 }, { background: true });
            await db.collection('groups').createIndex({ jid: 1 }, { unique: true, background: true });
            await db.collection('messages').createIndex({ messageId: 1 }, { unique: true, background: true });
            await db.collection('messages').createIndex({ from: 1, timestamp: -1 }, { background: true });
            await db.collection('logs').createIndex({ timestamp: -1 }, { background: true });
        } catch (error) {
            logger.debug(`Index creation skipped: ${error.message}`);
        }
    }

    async getStats() {
        if (mongoose.connection.readyState !== 1) return null;
        try {
            const stats = await mongoose.connection.db.stats();
            return {
                connected: true,
                database: stats.db,
                collections: stats.collections,
                dataSize: Math.round(stats.dataSize / 1024 / 1024 * 100) / 100,
                indexSize: Math.round(stats.indexSize / 1024 / 1024 * 100) / 100
            };
        } catch {
            return null;
        }
    }

    async healthCheck() {
        try {
            if (mongoose.connection.readyState !== 1) return false;
            await mongoose.connection.db.admin().ping();
            return true;
        } catch {
            return false;
        }
    }

    async backup() {
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected');
        }

        try {
            logger.info('Starting database backup...');

            const backupData = {
                timestamp: new Date().toISOString(),
                users: await mongoose.connection.db.collection('users').find({}).toArray(),
                groups: await mongoose.connection.db.collection('groups').find({}).toArray(),
                settings: await mongoose.connection.db.collection('settings').find({}).toArray(),
                premium: await mongoose.connection.db.collection('premium').find({}).toArray()
            };

            const backupDir = path.join(process.cwd(), 'backups', 'database');
            await fs.ensureDir(backupDir);

            const backupFile = path.join(backupDir, `backup_${Date.now()}.json`);
            await fs.writeJSON(backupFile, backupData, { spaces: 2 });

            logger.info(`Database backup saved: ${backupFile}`);
            return backupFile;
        } catch (error) {
            logger.error('Database backup failed:', error.message);
            throw error;
        }
    }

    async restore(backupFile) {
        if (mongoose.connection.readyState !== 1) {
            throw new Error('Database not connected');
        }

        try {
            logger.info(`Restoring database from: ${backupFile}`);

            const backupData = await fs.readJSON(backupFile);
            const collections = ['users', 'groups', 'settings', 'premium'];

            for (const col of collections) {
                if (backupData[col] && backupData[col].length > 0) {
                    await mongoose.connection.db.collection(col).deleteMany({});
                    await mongoose.connection.db.collection(col).insertMany(backupData[col]);
                    logger.info(`Restored ${col}: ${backupData[col].length} records`);
                }
            }

            logger.info('✅ Database restoration completed');
        } catch (error) {
            logger.error('Database restoration failed:', error.message);
            throw error;
        }
    }

    async cleanup() {
        if (mongoose.connection.readyState !== 1) return;

        try {
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            const r1 = await mongoose.connection.db.collection('messages')
                .deleteMany({ timestamp: { $lt: thirtyDaysAgo }, isCommand: false });

            const r2 = await mongoose.connection.db.collection('logs')
                .deleteMany({ timestamp: { $lt: thirtyDaysAgo }, level: { $in: ['debug', 'silly'] } });

            const r3 = await mongoose.connection.db.collection('commands')
                .deleteMany({ timestamp: { $lt: sevenDaysAgo } });

            logger.info(`Cleanup: removed ${r1.deletedCount + r2.deletedCount + r3.deletedCount} records`);
        } catch (error) {
            logger.error('Database cleanup failed:', error.message);
        }
    }

    isHealthy() {
        return this.isConnected && mongoose.connection.readyState === 1;
    }

    getConnectionState() {
        const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
        return {
            state: states[mongoose.connection.readyState] || 'unknown',
            readyState: mongoose.connection.readyState,
            isConnected: this.isConnected,
            reconnectAttempts: this.reconnectAttempts
        };
    }
}

const databaseManager = new DatabaseManager();

export const connectToDatabase = () => databaseManager.connectToDatabase();
export const getStats = () => databaseManager.getStats();
export const healthCheck = () => databaseManager.healthCheck();
export const backup = () => databaseManager.backup();
export const restore = (file) => databaseManager.restore(file);
export const cleanup = () => databaseManager.cleanup();
export const isHealthy = () => databaseManager.isHealthy();
export const getConnectionState = () => databaseManager.getConnectionState();
export const databaseManagerInstance = databaseManager;
