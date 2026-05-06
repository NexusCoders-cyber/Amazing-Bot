import NodeCache from 'node-cache';
import config from '../config.js';
import logger from './logger.js';

class CacheManager {
    constructor() {
        this.nodeCache = new NodeCache({
            stdTTL: config.performance?.cacheTTL || 3600,
            maxKeys: config.performance?.cacheSize || 1000,
            checkperiod: 120,
            useClones: false
        });

        this.redisClient = null;
        this.useRedis = false;
        this.isInitialized = false;
        this.stats = {
            hits: 0,
            misses: 0,
            sets: 0,
            deletes: 0
        };
    }

    async initializeCache() {
        if (this.isInitialized) return;
        try {
            this.setupEventListeners();
            this.isInitialized = true;
            logger.info('Cache system initialized successfully');
        } catch (error) {
            logger.error('Cache initialization failed:', error);
            throw error;
        }
    }

    setupEventListeners() {
        this.nodeCache.on('set', () => { this.stats.sets++; });
        this.nodeCache.on('del', () => { this.stats.deletes++; });
        this.nodeCache.on('expired', (key) => {
            logger.debug(`Cache key expired: ${key}`);
        });
    }

    async get(key) {
        try {
            const value = this.nodeCache.get(key);
            if (value !== undefined) {
                this.stats.hits++;
                return value;
            }
            this.stats.misses++;
            return null;
        } catch (error) {
            logger.error(`Cache get error for key ${key}:`, error);
            this.stats.misses++;
            return null;
        }
    }

    async set(key, value, ttl = null) {
        try {
            const expiry = ttl || config.performance?.cacheTTL || 3600;
            this.nodeCache.set(key, value, expiry);
            this.stats.sets++;
            return true;
        } catch (error) {
            logger.error(`Cache set error for key ${key}:`, error);
            return false;
        }
    }

    async del(key) {
        try {
            const deleted = this.nodeCache.del(key);
            if (deleted > 0) this.stats.deletes++;
            return deleted > 0;
        } catch (error) {
            logger.error(`Cache delete error for key ${key}:`, error);
            return false;
        }
    }

    async has(key) {
        try {
            return this.nodeCache.has(key);
        } catch (error) {
            return false;
        }
    }

    async keys(pattern = '*') {
        try {
            const nodeKeys = this.nodeCache.keys();
            if (pattern === '*') return nodeKeys;
            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
            return nodeKeys.filter(key => regex.test(key));
        } catch (error) {
            logger.error(`Cache keys error:`, error);
            return [];
        }
    }

    async flush() {
        try {
            this.nodeCache.flushAll();
            logger.info('Cache flushed successfully');
            return true;
        } catch (error) {
            logger.error('Cache flush error:', error);
            return false;
        }
    }

    async flushByPattern(pattern) {
        try {
            const keys = await this.keys(pattern);
            for (const key of keys) await this.del(key);
            return keys.length;
        } catch (error) {
            logger.error(`Cache flush by pattern error:`, error);
            return 0;
        }
    }

    async mget(keys) {
        const results = {};
        for (const key of keys) results[key] = await this.get(key);
        return results;
    }

    async mset(keyValuePairs, ttl = null) {
        const results = {};
        for (const [key, value] of Object.entries(keyValuePairs)) {
            results[key] = await this.set(key, value, ttl);
        }
        return results;
    }

    async increment(key, value = 1, ttl = null) {
        const current = (await this.get(key)) || 0;
        const newValue = current + value;
        await this.set(key, newValue, ttl);
        return newValue;
    }

    async decrement(key, value = 1, ttl = null) {
        const current = (await this.get(key)) || 0;
        const newValue = Math.max(0, current - value);
        await this.set(key, newValue, ttl);
        return newValue;
    }

    async getStats() {
        const nodeStats = this.nodeCache.getStats();
        const total = this.stats.hits + this.stats.misses;
        return {
            nodeCache: {
                hits: this.stats.hits,
                misses: this.stats.misses,
                sets: this.stats.sets,
                deletes: this.stats.deletes,
                hitRate: total > 0 ? (this.stats.hits / total) : 0,
                keys: nodeStats.keys,
                ksize: nodeStats.ksize,
                vsize: nodeStats.vsize
            },
            redis: { enabled: false, connected: false }
        };
    }

    async cleanup() {
        try {
            const keys = this.nodeCache.keys();
            const now = Date.now();
            let cleaned = 0;
            for (const key of keys) {
                const ttl = this.nodeCache.getTtl(key);
                if (ttl && ttl < now) {
                    this.nodeCache.del(key);
                    cleaned++;
                }
            }
            return cleaned;
        } catch (error) {
            return 0;
        }
    }

    async isHealthy() {
        try {
            const testKey = '_health_' + Date.now();
            await this.set(testKey, 1, 5);
            const val = await this.get(testKey);
            await this.del(testKey);
            return val === 1;
        } catch {
            return false;
        }
    }

    async getOrSet(key, factory, ttl = null) {
        let value = await this.get(key);
        if (value === null) {
            value = await factory();
            if (value !== null && value !== undefined) {
                await this.set(key, value, ttl);
            }
        }
        return value;
    }

    createNamespace(prefix) {
        return {
            get: (key) => this.get(`${prefix}:${key}`),
            set: (key, value, ttl) => this.set(`${prefix}:${key}`, value, ttl),
            del: (key) => this.del(`${prefix}:${key}`),
            has: (key) => this.has(`${prefix}:${key}`),
            keys: () => this.keys(`${prefix}:*`),
            flush: () => this.flushByPattern(`${prefix}:*`),
            increment: (key, value, ttl) => this.increment(`${prefix}:${key}`, value, ttl),
            decrement: (key, value, ttl) => this.decrement(`${prefix}:${key}`, value, ttl)
        };
    }

    async disconnect() {
        this.nodeCache.flushAll();
        this.isInitialized = false;
    }
}

const cacheManager = new CacheManager();

const userCache = cacheManager.createNamespace('user');
const groupCache = cacheManager.createNamespace('group');
const commandCache = cacheManager.createNamespace('command');
const mediaCache = cacheManager.createNamespace('media');
const sessionCache = cacheManager.createNamespace('session');

export const cache = cacheManager;
export { userCache, groupCache, commandCache, mediaCache, sessionCache };
export const initializeCache = () => cacheManager.initializeCache();
export const get = (key) => cacheManager.get(key);
export const set = (key, value, ttl) => cacheManager.set(key, value, ttl);
export const del = (key) => cacheManager.del(key);
export const has = (key) => cacheManager.has(key);
export const keys = (pattern) => cacheManager.keys(pattern);
export const flush = () => cacheManager.flush();
export const flushByPattern = (pattern) => cacheManager.flushByPattern(pattern);
export const getStats = () => cacheManager.getStats();
export const cleanup = () => cacheManager.cleanup();
export const isHealthy = () => cacheManager.isHealthy();
export const getOrSet = (key, factory, ttl) => cacheManager.getOrSet(key, factory, ttl);

// Aliases used by analyticsService and scheduler
export const getCache = (key) => cacheManager.get(key);
export const setCache = (key, value, ttl) => cacheManager.set(key, value, ttl);
