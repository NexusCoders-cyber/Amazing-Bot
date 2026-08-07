import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import logger from './logger.js';
import AXIS_ALIAS_MAP from './axisAliasMap.js';
import { registerEventCommand } from './amazingbot.js';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SRC_COMMANDS = path.join(__dirname, '..', 'commands');
const SCRIPTS_CMDS = path.join(process.cwd(), 'scripts', 'cmds');
const SCRIPTS_EVENTS = path.join(process.cwd(), 'scripts', 'events');

function normalizeFromConfig(raw, category, filename, filepath) {
    const cfg = raw.config || {};
    const role = cfg.role ?? raw.role ?? 0;
    return {
        name: cfg.name || raw.name,
        aliases: cfg.aliases || raw.aliases || [],
        category: cfg.category || raw.category || category || 'general',
        description: cfg.shortDescription || cfg.longDescription || raw.description || '',
        longDescription: cfg.longDescription || raw.longDescription || '',
        usage: cfg.guide?.en || raw.usage || cfg.name || raw.name || '',
        example: raw.example || '',
        cooldown: cfg.coolDown ?? raw.cooldown ?? 0,
        role,
        ownerOnly: raw.ownerOnly ?? (role >= 2),
        sudoOnly: raw.sudoOnly ?? false,
        adminOnly: raw.adminOnly ?? (role >= 1),
        groupOnly: raw.groupOnly ?? false,
        privateOnly: raw.privateOnly ?? false,
        botAdminRequired: raw.botAdminRequired ?? false,
        noPrefix: cfg.noPrefix ?? raw.noPrefix ?? false,
        args: raw.args ?? false,
        minArgs: raw.minArgs ?? 0,
        execute: raw.execute || raw.onStart || null,
        onStart: raw.onStart || raw.execute || null,
        onChat: raw.onChat || null,
        onReply: raw.onReply || null,
        onReaction: raw.onReaction || null,
        category,
        filename,
        filepath,
        source: filepath.includes('scripts') ? 'scripts' : 'src',
    };
}

class CommandManager {
    constructor() {
        this.loadedCommands = new Map();
        this.commandCategories = new Map();
        this.aliases = new Map();
        this.externalAliases = new Map(Object.entries(AXIS_ALIAS_MAP));
        this.disabledCommands = new Set();
        this.commandUsage = new Map();
        this.isInitialized = false;
    }

    async initializeCommands() {
        if (this.isInitialized) return;
        await this.loadFromSrcCommands();
        await this.loadFromScriptsCmds();
        await this.loadEventScripts();
        await this.loadCustomCommands();
        this.isInitialized = true;
        logger.info(`CommandManager: ${this.loadedCommands.size} commands loaded`);
    }

    async loadFromSrcCommands() {
        if (!await fs.pathExists(SRC_COMMANDS)) return;
        const entries = await fs.readdir(SRC_COMMANDS, { withFileTypes: true });
        for (const entry of entries.filter(e => e.isDirectory())) {
            const catPath = path.join(SRC_COMMANDS, entry.name);
            const files = (await fs.readdir(catPath)).filter(f => f.endsWith('.js'));
            for (const file of files) {
                await this.loadCommandFile(path.join(catPath, file), entry.name);
            }
        }
    }

    async loadFromScriptsCmds() {
        await fs.ensureDir(SCRIPTS_CMDS);
        const files = (await fs.readdir(SCRIPTS_CMDS)).filter(f => f.endsWith('.js') && !f.endsWith('.eg.js'));
        for (const file of files) {
            await this.loadCommandFile(path.join(SCRIPTS_CMDS, file), null);
        }
    }

    async loadCustomCommands() {
        const cmdsPath = path.join(process.cwd(), 'data', 'custom_cmds.json');
        try {
            const raw = readFileSync(cmdsPath, 'utf8');
            const cmds = JSON.parse(raw);
            for (const [name, data] of Object.entries(cmds)) {
                if (this.loadedCommands.has(name)) continue;
                const cmd = {
                    name,
                    aliases: data.aliases || [],
                    category: data.category || 'general',
                    description: data.description || `Custom: ${name}`,
                    longDescription: data.description || '',
                    usage: `{prefix}${name}`,
                    cooldown: 3,
                    role: data.role || 0,
                    ownerOnly: (data.role || 0) >= 2,
                    adminOnly: (data.role || 0) >= 1,
                    groupOnly: false,
                    privateOnly: false,
                    noPrefix: false,
                    source: 'custom',
                    filepath: cmdsPath,
                    filename: `${name}.json`,
                    execute: async (ctx) => {
                        let text = data.response || '';
                        text = text.replace(/{user}/g, ctx.sender?.split('@')[0] || '');
                        text = text.replace(/{name}/g, ctx.pushName || ctx.sender?.split('@')[0] || '');
                        text = text.replace(/{prefix}/g, ctx.prefix || '.');
                        if (data.type === 'list' && data.items?.length) {
                            text += '\n\n' + data.items.map((item, i) => `${i + 1}. ${item}`).join('\n');
                        }
                        if (data.type === 'buttons' && data.items?.length) {
                            text += '\n\n' + data.items.map(item => `▸ ${item}`).join('\n');
                        }
                        if (data.image) {
                            await ctx.reply({ image: { url: data.image }, caption: text });
                        } else if (data.sticker) {
                            await ctx.reply({ sticker: { url: data.sticker } });
                        } else if (text) {
                            await ctx.reply(text);
                        }
                    },
                    onStart: null,
                    onChat: null,
                    onReply: null,
                    onReaction: null,
                };
                this.loadedCommands.set(name, cmd);
                for (const alias of cmd.aliases) {
                    this.aliases.set(alias, name);
                }
                if (!this.commandCategories.has(cmd.category)) {
                    this.commandCategories.set(cmd.category, []);
                }
                this.commandCategories.get(cmd.category).push(cmd);
            }
            logger.info(`CommandManager: loaded ${Object.keys(cmds).length} custom commands`);
        } catch {}
    }

    async loadEventScripts() {
        await fs.ensureDir(SCRIPTS_EVENTS);
        const files = (await fs.readdir(SCRIPTS_EVENTS)).filter(f => f.endsWith('.js') && !f.endsWith('.eg.js'));
        for (const file of files) {
            try {
                const url = `file://${path.join(SCRIPTS_EVENTS, file)}?t=${Date.now()}`;
                const mod = await import(url);
                const raw = mod.default || mod;
                if (!raw?.config?.name) continue;
                const eventCmd = normalizeFromConfig(raw, 'events', file, path.join(SCRIPTS_EVENTS, file));
                registerEventCommand(eventCmd.name, eventCmd);
                logger.debug(`Event script loaded: ${eventCmd.name}`);
            } catch (err) {
                logger.error(`Failed to load event script ${file}: ${err.message}`);
            }
        }
    }

    async loadCommandFile(filepath, fallbackCategory) {
        try {
            const url = `file://${filepath}?t=${Date.now()}`;
            const mod = await import(url);
            const raw = mod.default || mod;

            const name = raw?.config?.name || raw?.name;
            const hasEntry = typeof raw?.onStart === 'function' || typeof raw?.execute === 'function';

            if (!name || !hasEntry) {
                const hasNamed = Object.keys(mod || {}).some(k => k !== 'default');
                if (!hasNamed) logger.warn(`Skipped (invalid structure): ${filepath}`);
                return false;
            }

            const category = raw?.config?.category || raw?.category || fallbackCategory || 'general';
            const cmd = normalizeFromConfig(raw, category, path.basename(filepath), filepath);
            this.loadedCommands.set(cmd.name, cmd);

            if (!this.commandCategories.has(category)) this.commandCategories.set(category, []);
            const cat = this.commandCategories.get(category);
            if (!cat.includes(cmd.name)) cat.push(cmd.name);

            for (const alias of cmd.aliases) {
                this.aliases.set(alias, cmd.name);
            }

            if (!this.commandUsage.has(cmd.name)) {
                this.commandUsage.set(cmd.name, { used: 0, lastUsed: null, errors: 0, avgExecutionTime: 0 });
            }

            return true;
        } catch (err) {
            logger.error(`Failed to load ${filepath}: ${err.message}`);
            return false;
        }
    }

    async reloadCommand(commandName) {
        const cmd = this.getCommand(commandName, true);
        if (!cmd) return false;
        const cat = this.commandCategories.get(cmd.category) || [];
        const idx = cat.indexOf(cmd.name);
        if (idx > -1) cat.splice(idx, 1);
        this.loadedCommands.delete(cmd.name);
        for (const alias of cmd.aliases || []) this.aliases.delete(alias);
        return await this.loadCommandFile(cmd.filepath, cmd.category);
    }

    async reloadCategory(category) {
        for (const cmd of this.getCommandsByCategory(category, true)) {
            this.loadedCommands.delete(cmd.name);
            for (const alias of cmd.aliases || []) this.aliases.delete(alias);
        }
        this.commandCategories.set(category, []);
        const catPath = path.join(SRC_COMMANDS, category);
        if (await fs.pathExists(catPath)) {
            const files = (await fs.readdir(catPath)).filter(f => f.endsWith('.js'));
            for (const f of files) await this.loadCommandFile(path.join(catPath, f), category);
        }
        return this.commandCategories.get(category)?.length || 0;
    }

    async reloadAllCommands() {
        this.loadedCommands.clear();
        this.commandCategories.clear();
        this.aliases.clear();
        this.isInitialized = false;
        await this.initializeCommands();
        return this.loadedCommands.size;
    }

    getCommand(name, ignoreDisabled = false) {
        if (!name) return null;
        const mapped = this.externalAliases.get(name);
        const cmd = this.loadedCommands.get(name)
            || this.loadedCommands.get(this.aliases.get(name))
            || this.loadedCommands.get(mapped)
            || null;
        if (!cmd) return null;
        if (!ignoreDisabled && this.disabledCommands.has(cmd.name)) return null;
        return cmd;
    }

    getCommandsByCategory(category, includeDisabled = false) {
        return (this.commandCategories.get(category) || [])
            .map(n => this.loadedCommands.get(n))
            .filter(Boolean)
            .filter(c => includeDisabled || !this.disabledCommands.has(c.name));
    }

    getAllCommands(includeDisabled = false) {
        return Array.from(this.loadedCommands.values())
            .filter(c => includeDisabled || !this.disabledCommands.has(c.name));
    }

    getAllCategories() {
        return Array.from(this.commandCategories.keys());
    }

    enableCommand(name) { this.disabledCommands.delete(name); return true; }
    disableCommand(name) { this.disabledCommands.add(name); return true; }
    isCommandEnabled(name) { return !this.disabledCommands.has(name); }
    getDisabledCommands() { return Array.from(this.disabledCommands); }

    recordCommandUsage(commandName, executionTime, success = true) {
        const usage = this.commandUsage.get(commandName);
        if (!usage) return;
        usage.used++;
        usage.lastUsed = new Date();
        if (success) {
            usage.avgExecutionTime = Math.round(
                (usage.avgExecutionTime * (usage.used - 1) + executionTime) / usage.used
            );
        } else {
            usage.errors++;
        }
    }

    searchCommands(query) {
        const q = query.toLowerCase();
        return Array.from(this.loadedCommands.values())
            .filter(c => !this.disabledCommands.has(c.name) && (
                c.name.includes(q) ||
                c.aliases?.some(a => a.includes(q)) ||
                c.description?.toLowerCase().includes(q)
            ))
            .sort((a, b) => (a.name === q ? -1 : b.name === q ? 1 : 0));
    }

    getSystemStats() {
        return {
            totalCommands: this.loadedCommands.size,
            enabledCommands: this.loadedCommands.size - this.disabledCommands.size,
            disabledCommands: this.disabledCommands.size,
            categories: this.commandCategories.size,
            totalAliases: this.aliases.size,
        };
    }

    getTopCommands(limit = 10) {
        return Array.from(this.commandUsage.entries())
            .sort((a, b) => b[1].used - a[1].used)
            .slice(0, limit)
            .map(([name, stats]) => ({ name, ...stats }));
    }
}

export const commandManager = new CommandManager();

export const initializeCommands = () => commandManager.initializeCommands();
export const getCommand = (name) => commandManager.getCommand(name);
export const getAllCommands = () => commandManager.getAllCommands();
export const getCommandsByCategory = (cat) => commandManager.getCommandsByCategory(cat);
export const getAllCategories = () => commandManager.getAllCategories();
export const reloadCommand = (name) => commandManager.reloadCommand(name);
export const reloadCategory = (cat) => commandManager.reloadCategory(cat);
export const reloadAllCommands = () => commandManager.reloadAllCommands();
export const enableCommand = (name) => commandManager.enableCommand(name);
export const disableCommand = (name) => commandManager.disableCommand(name);
export const isCommandEnabled = (name) => commandManager.isCommandEnabled(name);
export const searchCommands = (query) => commandManager.searchCommands(query);
export const getSystemStats = () => commandManager.getSystemStats();
export const recordCommandUsage = (n, t, s) => commandManager.recordCommandUsage(n, t, s);
export const getTopCommands = (limit) => commandManager.getTopCommands(limit);

export default commandManager;
