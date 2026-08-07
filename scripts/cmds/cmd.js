import fs from 'fs-extra';
import path from 'path';

const CMDS_DIR = path.join(process.cwd(), 'scripts', 'cmds');

const TEMPLATE = `export default {
    config: {
        name: '{name}',
        aliases: [],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Description here',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}{name} <args>' },
    },

    async onStart({ sock, message, args, from, sender, isGroup, isGroupAdmin,
        isBotAdmin, isOwner, prefix, pushName, usersData, threadsData,
        AmazingBot, send, reply, React }) {

        return reply('Hello from {name}!');
    },

    async onChat({ message, from, sender, chatText, send, reply }) {
    },

    async onReply({ message, from, sender, Reply, reply }) {
    },

    async onReaction({ message, from, sender, Reaction }) {
    },
};
`;

async function getCommandFile(name) {
    const file = path.join(CMDS_DIR, `${name}.js`);
    if (await fs.pathExists(file)) return file;
    return null;
}

async function readQuotedText(message) {
    const ctx = message?.message?.extendedTextMessage?.contextInfo;
    const quoted = ctx?.quotedMessage;
    if (!quoted) return null;
    return quoted.conversation || quoted.extendedTextMessage?.text || quoted.imageMessage?.caption || quoted.videoMessage?.caption || null;
}

export default {
    config: {
        name: 'cmd',
        aliases: ['command'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Manage AmazingBot commands - create, edit, delete, reload, source',
        category: 'owner',
        coolDown: 0,
        role: 2,
        guide: { en: '{prefix}cmd list | create <name> | edit <name> | delete <name> | reload <name> | reloadall | source <name> | info <name>' },
    },

    async onStart({ sock, message, args, from, sender, prefix, reply }) {
        const sub = (args[0] || '').toLowerCase().trim();

        if (!sub || sub === 'help') {
            return reply(
                'cmd list - list all commands\n' +
                'cmd create <name> - create a new command (reply to code to create from it)\n' +
                'cmd edit <name> - reply to code to overwrite a command\n' +
                'cmd source <name> - view command source\n' +
                'cmd delete <name> - delete a command\n' +
                'cmd reload <name> - reload a command\n' +
                'cmd reloadall - reload every command\n' +
                'cmd info <name> - show command config\n' +
                'cmd template <name> - get a blank template'
            );
        }

        const name = (args[1] || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');

        if (sub === 'list') {
            await fs.ensureDir(CMDS_DIR);
            const files = (await fs.readdir(CMDS_DIR)).filter(f => f.endsWith('.js') && !f.endsWith('.eg.js'));
            if (!files.length) return reply('No commands found in scripts/cmds/');
            const names = files.map(f => f.replace('.js', '')).sort();
            return reply(`Commands (${names.length}):\n\n${names.join(', ')}`);
        }

        if (sub === 'template') {
            const tName = name || 'mycommand';
            const code = TEMPLATE.replace(/{name}/g, tName).replace(/{prefix}/g, prefix);
            return sock.sendMessage(from, { text: code }, { quoted: message });
        }

        if (sub === 'create') {
            if (!name) return reply(`Provide a name: cmd create <name>`);
            const file = path.join(CMDS_DIR, `${name}.js`);

            if (await fs.pathExists(file)) return reply(`${name}.js already exists.\nUse cmd edit ${name} to modify it.`);

            const quotedCode = await readQuotedText(message);

            if (quotedCode && quotedCode.includes('export default')) {
                await fs.writeFile(file, quotedCode, 'utf-8');
                return reply(`Command ${name} created from your code.\nUse cmd reload ${name} to load it.`);
            }

            const code = TEMPLATE.replace(/{name}/g, name).replace(/{prefix}/g, prefix);
            await fs.writeFile(file, code, 'utf-8');
            return reply(`Command ${name} created with template.\nLocation: scripts/cmds/${name}.js\nEdit it then use: cmd reload ${name}`);
        }

        if (sub === 'edit') {
            if (!name) return reply(`Provide a name: cmd edit <name>`);
            const file = await getCommandFile(name);
            if (!file) return reply(`Command ${name} not found.\nUse cmd create ${name} to make it.`);

            const quotedCode = await readQuotedText(message);
            if (!quotedCode) {
                return reply(`To edit ${name}: send the new code as a message, then reply to it with: cmd edit ${name}`);
            }

            const backup = await fs.readFile(file, 'utf-8');
            await fs.writeFile(file, quotedCode, 'utf-8');

            try {
                const { reloadCommand } = await import('../../src/utils/commandManager.js');
                await reloadCommand(name);
                return reply(`${name} updated and reloaded successfully.`);
            } catch (err) {
                await fs.writeFile(file, backup, 'utf-8');
                return reply(`Code has an error, reverted to backup:\n${err.message}`);
            }
        }

        if (sub === 'source') {
            if (!name) return reply(`Provide a name: cmd source <name>`);
            const file = await getCommandFile(name);
            if (!file) return reply(`Command ${name} not found.`);
            const code = await fs.readFile(file, 'utf-8');
            const trimmed = code.length > 4000 ? code.slice(0, 4000) + '\n...(truncated)' : code;
            return sock.sendMessage(from, { text: trimmed }, { quoted: message });
        }

        if (sub === 'delete') {
            if (!name) return reply(`Provide a name: cmd delete <name>`);
            const file = await getCommandFile(name);
            if (!file) return reply(`Command ${name} not found.`);
            await fs.remove(file);
            try {
                const { commandManager } = await import('../../src/utils/commandManager.js');
                commandManager.loadedCommands.delete(name);
                commandManager.aliases.forEach((v, k) => { if (v === name) commandManager.aliases.delete(k); });
            } catch {}
            return reply(`Command ${name} deleted.`);
        }

        if (sub === 'reload') {
            if (!name) return reply(`Provide a name: cmd reload <name>`);
            const file = await getCommandFile(name);
            if (!file) return reply(`${name}.js not found in scripts/cmds/`);
            try {
                const { reloadCommand } = await import('../../src/utils/commandManager.js');
                await reloadCommand(name);
                return reply(`Command ${name} reloaded.`);
            } catch (err) {
                return reply(`Failed to reload ${name}:\n${err.message}`);
            }
        }

        if (sub === 'reloadall') {
            try {
                const { reloadAllCommands } = await import('../../src/utils/commandManager.js');
                const count = await reloadAllCommands();
                return reply(`All commands reloaded. Total loaded: ${count}`);
            } catch (err) {
                return reply(`Reload all failed:\n${err.message}`);
            }
        }

        if (sub === 'info') {
            if (!name) return reply(`Provide a name: cmd info <name>`);
            const { getCommand } = await import('../../src/utils/commandManager.js');
            const cmd = getCommand(name);
            if (!cmd) return reply(`Command ${name} is not loaded.`);
            const roleMap = { 0: 'Everyone', 1: 'Group Admin', 2: 'Bot Owner' };
            return reply([
                `Name       : ${cmd.name}`,
                `Aliases    : ${cmd.aliases?.join(', ') || 'none'}`,
                `Category   : ${cmd.category || 'general'}`,
                `Info       : ${cmd.description || 'none'}`,
                `Usage      : ${prefix}${cmd.usage || cmd.name}`,
                `Cooldown   : ${cmd.cooldown || 0}s`,
                `Role       : ${roleMap[cmd.role ?? 0]}`,
                `Group Only : ${cmd.groupOnly ? 'Yes' : 'No'}`,
                `No Prefix  : ${cmd.noPrefix ? 'Yes' : 'No'}`,
                `onReply    : ${typeof cmd.onReply === 'function' ? 'Yes' : 'No'}`,
                `onReaction : ${typeof cmd.onReaction === 'function' ? 'Yes' : 'No'}`,
                `onChat     : ${typeof cmd.onChat === 'function' ? 'Yes' : 'No'}`,
                `Source     : ${cmd.source || 'src'}`,
            ].join('\n'));
        }

        return reply(`Unknown subcommand: ${sub}\nUse cmd help to see all options.`);
    },
};
