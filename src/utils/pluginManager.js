import logger from './logger.js';

class PluginManager {
    constructor() {
        this.activePlugins = new Set();
    }

    getPluginStats() {
        return { total: 0, active: this.activePlugins.size, loaded: 0, errors: 0 };
    }
}

export const pluginManager = new PluginManager();

export const loadPlugins = () => {
    logger.info('Plugin system initialized');
    return Promise.resolve();
};

export const getActiveCount = () => pluginManager.activePlugins.size;
