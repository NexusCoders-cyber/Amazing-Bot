import fs from 'fs-extra';
import path from 'path';

const CMDS_DIR = path.join(process.cwd(), 'scripts', 'cmds');
const SOURCE_TEXT_LIMIT = 3500;

const TEMPLATE = `export default {
    config: {
        name: '{name}',
        aliases: [],
        author: 'Raphael Ilom',
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

function box(icon, title, lines = []) {
    const header = `${icon} 「 ${title} 」`;
    const divider = '───────────────';
    const body = lines.filter(l => l !== null && l !== undefined).join('\n');
    return body ? `${header}\n${divider}\n${body}` : header;
}

function errorBox(title, name, err) {
    return box('❌', title, [
        `📦 Command : ${name}`,
        `⚠️ Error   :`,
        '```' + (err?.message || String(err)) + '```',
        '',
        `🔧 Fix the code above then run: cmd edit ${name} (or cmd reload ${name})`
    ]);
}

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

async function sendSource(sock, from, message, name, code) {
    if (code.length <= SOURCE_TEXT_LIMIT) {
        return sock.sendMessage(from, {
            text: box('📜', `SOURCE — ${name}`, ['```' + code + '```'])
        }, { quoted: message });
    }
    return sock.sendMessage(from, {
        document: Buffer.from(code, 'utf-8'),
        fileName: `${name}.js`,
        mimetype: 'text/javascript',
        caption: box('📜', `SOURCE — ${name}`, [
            `📁 File   : ${name}.js`,
            `📏 Size   : ${code.length} characters`,
            `ℹ️ Sent as a file since it's too long for a text message.`
        ])
    }, { quoted: message });
}

export default {
    config: {
        name: 'cmd',
        aliases: ['command'],
        author: 'Raphael Ilom',
        version: '1.1',
        shortDescription: 'Manage AmazingBot commands - create, edit, delete, reload, source',
        category: 'owner',
        coolDown: 0,
        role: 2,
        guide: { en: '{prefix}cmd list | create <name> | edit <name> | delete <name> | reload <name> | reloadall | source <name> | info <name>' },
    },

    async onStart({ sock, message, args, from, sender, prefix, reply }) {
        const sub = (args[0] || '').toLowerCase().trim();

        if (!sub || sub === 'help') {
            return reply(box('🛠️', 'CMD MANAGER', [
                `📋 ${prefix}cmd list — list all commands`,
                `🆕 ${prefix}cmd create <name> — create a new command (reply to code to create from it)`,
                `✏️ ${prefix}cmd edit <name> — reply to code to overwrite a command`,
                `📜 ${prefix}cmd source <name> — view full command source`,
                `🗑️ ${prefix}cmd delete <name> — delete a command`,
                `♻️ ${prefix}cmd reload <name> — reload a command`,
                `🔁 ${prefix}cmd reloadall — reload every command`,
                `ℹ️ ${prefix}cmd info <name> — show command config`,
                `📄 ${prefix}cmd template <name> — get a blank template`
            ]));
        }

        const name = (args[1] || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');

        if (sub === 'list') {
            await fs.ensureDir(CMDS_DIR);
            const files = (await fs.readdir(CMDS_DIR)).filter(f => f.endsWith('.js') && !f.endsWith('.eg.js'));
            if (!files.length) return reply(box('📭', 'NO COMMANDS FOUND'));
            const names = files.map(f => f.replace('.js', '')).sort();
            return reply(box('📋', `COMMANDS (${names.length})`, [names.join(', ')]));
        }

        if (sub === 'template') {
            const tName = name || 'mycommand';
            const code = TEMPLATE.replace(/{name}/g, tName).replace(/{prefix}/g, prefix);
            return sendSource(sock, from, message, tName, code);
        }

        if (sub === 'create') {
            if (!name) return reply(box('⚠️', 'MISSING NAME', [`Usage: ${prefix}cmd create <name>`]));
            const file = path.join(CMDS_DIR, `${name}.js`);

            if (await fs.pathExists(file)) {
                return reply(box('⚠️', 'ALREADY EXISTS', [
                    `📦 ${name}.js already exists.`,
                    `✏️ Use ${prefix}cmd edit ${name} to modify it.`
                ]));
            }

            const quotedCode = await readQuotedText(message);
            const code = (quotedCode && quotedCode.includes('export default'))
                ? quotedCode
                : TEMPLATE.replace(/{name}/g, name).replace(/{prefix}/g, prefix);

            await fs.writeFile(file, code, 'utf-8');

            try {
                const { loadNewCommandFile } = await import('../../src/utils/commandManager.js');
                await loadNewCommandFile(file, 'general');
                return reply(box('✅', 'COMMAND CREATED', [
                    `📦 Name     : ${name}`,
                    `📁 Location : scripts/cmds/${name}.js`,
                    `♻️ Status   : loaded and ready to use!`
                ]));
            } catch (err) {
                await fs.remove(file);
                return reply(errorBox('CREATE FAILED', name, err));
            }
        }

        if (sub === 'edit') {
            if (!name) return reply(box('⚠️', 'MISSING NAME', [`Usage: ${prefix}cmd edit <name>`]));
            const file = await getCommandFile(name);
            if (!file) {
                return reply(box('⚠️', 'NOT FOUND', [
                    `📦 Command ${name} not found.`,
                    `🆕 Use ${prefix}cmd create ${name} to make it.`
                ]));
            }

            const quotedCode = await readQuotedText(message);
            if (!quotedCode) {
                return reply(box('ℹ️', 'HOW TO EDIT', [
                    `Send the new code as a message, then reply to it with:`,
                    `${prefix}cmd edit ${name}`
                ]));
            }

            const backup = await fs.readFile(file, 'utf-8');
            await fs.writeFile(file, quotedCode, 'utf-8');

            try {
                const { reloadCommand } = await import('../../src/utils/commandManager.js');
                await reloadCommand(name);
                return reply(box('✅', 'COMMAND UPDATED', [
                    `📦 Name   : ${name}`,
                    `♻️ Status : reloaded successfully!`
                ]));
            } catch (err) {
                await fs.writeFile(file, backup, 'utf-8');
                const { reloadCommand } = await import('../../src/utils/commandManager.js');
                try { await reloadCommand(name); } catch {}
                return reply(errorBox('EDIT FAILED — reverted to previous version', name, err));
            }
        }

        if (sub === 'source') {
            if (!name) return reply(box('⚠️', 'MISSING NAME', [`Usage: ${prefix}cmd source <name>`]));
            const file = await getCommandFile(name);
            if (!file) return reply(box('⚠️', 'NOT FOUND', [`Command ${name} not found.`]));
            const code = await fs.readFile(file, 'utf-8');
            return sendSource(sock, from, message, name, code);
        }

        if (sub === 'delete') {
            if (!name) return reply(box('⚠️', 'MISSING NAME', [`Usage: ${prefix}cmd delete <name>`]));
            const file = await getCommandFile(name);
            if (!file) return reply(box('⚠️', 'NOT FOUND', [`Command ${name} not found.`]));
            await fs.remove(file);
            try {
                const { commandManager } = await import('../../src/utils/commandManager.js');
                commandManager.loadedCommands.delete(name);
                commandManager.aliases.forEach((v, k) => { if (v === name) commandManager.aliases.delete(k); });
            } catch {}
            return reply(box('🗑️', 'COMMAND DELETED', [`📦 ${name} has been removed.`]));
        }

        if (sub === 'reload') {
            if (!name) return reply(box('⚠️', 'MISSING NAME', [`Usage: ${prefix}cmd reload <name>`]));
            const file = await getCommandFile(name);
            if (!file) return reply(box('⚠️', 'NOT FOUND', [`${name}.js not found in scripts/cmds/`]));
            try {
                const { reloadCommand } = await import('../../src/utils/commandManager.js');
                await reloadCommand(name);
                return reply(box('♻️', 'COMMAND RELOADED', [`📦 ${name} reloaded successfully!`]));
            } catch (err) {
                return reply(errorBox('RELOAD FAILED', name, err));
            }
        }

        if (sub === 'reloadall') {
            try {
                const { reloadAllCommands } = await import('../../src/utils/commandManager.js');
                const count = await reloadAllCommands();
                return reply(box('🔁', 'ALL COMMANDS RELOADED', [`📦 Total loaded: ${count}`]));
            } catch (err) {
                return reply(box('❌', 'RELOAD ALL FAILED', ['```' + (err.message || String(err)) + '```']));
            }
        }

        if (sub === 'info') {
            if (!name) return reply(box('⚠️', 'MISSING NAME', [`Usage: ${prefix}cmd info <name>`]));
            const { getCommand } = await import('../../src/utils/commandManager.js');
            const cmd = getCommand(name);
            if (!cmd) return reply(box('⚠️', 'NOT LOADED', [`Command ${name} is not loaded.`]));
            const roleMap = { 0: 'Everyone', 1: 'Group Admin', 2: 'Bot Owner' };
            return reply(box('ℹ️', `INFO — ${cmd.name}`, [
                `📦 Name       : ${cmd.name}`,
                `🔗 Aliases    : ${cmd.aliases?.join(', ') || 'none'}`,
                `📂 Category   : ${cmd.category || 'general'}`,
                `📝 Info       : ${cmd.description || 'none'}`,
                `⌨️ Usage      : ${prefix}${cmd.usage || cmd.name}`,
                `⏱️ Cooldown   : ${cmd.cooldown || 0}s`,
                `👑 Role       : ${roleMap[cmd.role ?? 0]}`,
                `👥 Group Only : ${cmd.groupOnly ? 'Yes' : 'No'}`,
                `🚫 No Prefix  : ${cmd.noPrefix ? 'Yes' : 'No'}`,
                `↩️ onReply    : ${typeof cmd.onReply === 'function' ? 'Yes' : 'No'}`,
                `👆 onReaction : ${typeof cmd.onReaction === 'function' ? 'Yes' : 'No'}`,
                `💬 onChat     : ${typeof cmd.onChat === 'function' ? 'Yes' : 'No'}`,
                `📁 Source     : ${cmd.source || 'src'}`,
            ]));
        }

        return reply(box('❓', 'UNKNOWN SUBCOMMAND', [`Use ${prefix}cmd help to see all options.`]));
    },
};
