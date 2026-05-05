import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logger from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class PluginManager {
    constructor() {
        this.plugins = new Map();
        this.activePlugins = new Set();
        this.pluginStates = new Map();
        this.pluginDir = path.join(__dirname, '..', 'plugins');
    }

    async loadPlugin(pluginName) {
        try {
            const pluginPath = path.join(this.pluginDir, `${pluginName}.js`);

            if (!await fs.pathExists(pluginPath)) {
                return false;
            }

            const content = await fs.readFile(pluginPath, 'utf8');
            if (!content || !content.trim()) {
                return false;
            }

            const pluginUrl = `file://${pluginPath}?t=${Date.now()}`;
            const pluginModule = await import(pluginUrl);
            const plugin = pluginModule.default || pluginModule;

            if (!plugin || typeof plugin !== 'object') {
                return false;
            }

            this.plugins.set(pluginName, plugin);
            this.pluginStates.set(pluginName, 'loaded');

            if (plugin.enabled !== false) {
                await this.activatePlugin(pluginName);
            }

            return true;
        } catch (error) {
            logger.error(`Failed to load plugin ${pluginName}: ${error.message}`);
            this.pluginStates.set(pluginName, 'error');
            return false;
        }
    }

    async activatePlugin(name) {
        try {
            const plugin = this.plugins.get(name);
            if (!plugin) return false;

            if (plugin.onLoad && typeof plugin.onLoad === 'function') {
                await plugin.onLoad();
            }

            this.activePlugins.add(name);
            this.pluginStates.set(name, 'active');
            return true;
        } catch (error) {
            logger.error(`Failed to activate plugin ${name}: ${error.message}`);
            this.pluginStates.set(name, 'error');
            return false;
        }
    }

    async loadAllPlugins() {
        if (!await fs.pathExists(this.pluginDir)) {
            return;
        }

        const files = (await fs.readdir(this.pluginDir)).filter(f => f.endsWith('.js'));

        for (const file of files) {
            const pluginName = file.replace('.js', '');
            await this.loadPlugin(pluginName);
        }
    }

    getPluginStats() {
        return {
            total: this.plugins.size,
            active: this.activePlugins.size,
            loaded: Array.from(this.pluginStates.values()).filter(s => s === 'loaded').length,
            errors: Array.from(this.pluginStates.values()).filter(s => s === 'error').length
        };
    }

    getPlugin(name) {
        return this.plugins.get(name);
    }

    getAllPlugins() {
        return Array.from(this.plugins.values());
    }
}

export const pluginManager = new PluginManager();

export const loadPlugins = async () => {
    await pluginManager.loadAllPlugins();
    logger.info(`Plugin system initialized (${pluginManager.activePlugins.size} active)`);
};

export const getActiveCount = () => pluginManager.activePlugins.size;
export const getPlugin = (name) => pluginManager.getPlugin(name);
export const getAllPlugins = () => pluginManager.getAllPlugins();
export const getPluginStats = () => pluginManager.getPluginStats();
