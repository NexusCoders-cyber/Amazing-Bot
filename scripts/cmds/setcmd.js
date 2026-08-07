import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CMDS_PATH = path.join(__dirname, '../../data/custom_cmds.json');

let customCmds = null;

function loadCmds() {
    if (customCmds) return customCmds;
    try { customCmds = fs.readJsonSync(CMDS_PATH); } catch { customCmds = {}; }
    return customCmds;
}

function saveCmds() {
    try {
        fs.ensureDirSync(path.dirname(CMDS_PATH));
        fs.writeJsonSync(CMDS_PATH, customCmds, { spaces: 2 });
    } catch {}
}

// Auto-load custom commands into the command system
export function getCustomCommands() {
    const cmds = loadCmds();
    return Object.entries(cmds).map(([name, data]) => ({
        name,
        aliases: data.aliases || [],
        category: data.category || 'general',
        description: data.description || `Custom command: ${name}`,
        author: data.author || 'Unknown',
        role: data.role || 0,
        onStart: async ({ reply, sender, args, prefix }) => {
            if (data.response) {
                let text = data.response;
                // Replace variables
                text = text.replace(/{user}/g, sender.split('@')[0]);
                text = text.replace(/{name}/g, sender.split('@')[0]);
                text = text.replace(/{prefix}/g, prefix);
                if (data.type === 'list' && data.items?.length) {
                    text += '\n\n' + data.items.map((item, i) => `${i + 1}. ${item}`).join('\n');
                }
                if (data.type === 'buttons' && data.items?.length) {
                    text += '\n\n' + data.items.map(item => `▸ ${item}`).join('\n');
                }
                reply(text);
            } else if (data.image) {
                reply({ image: { url: data.image }, caption: data.caption || '' });
            } else if (data.sticker) {
                reply({ sticker: { url: data.sticker } });
            } else {
                reply(`Command "${name}" exists but has no response configured.`);
            }
        },
    }));
}

export default {
    config: {
        name: 'setcmd',
        aliases: ['addcmd', 'createcmd'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Create a custom command',
        category: 'owner',
        coolDown: 5,
        role: 2,
        guide: {
            en: '{prefix}setcmd <name> | <response>\n{prefix}setcmd <name> | type=list | items=item1,item2,item3\n{prefix}setcmd <name> | type=image | url=<image_url>\n{prefix}setcmd <name> | type=sticker | url=<sticker_url>'
        },
    },

    async onStart({ args, reply, sender, prefix, React }) {
        React('🔧');

        if (!args.length) {
            return reply([
                `━━━━━━━━━━━━━━━━━━━━`,
                `  🔧 *CUSTOM CMD CREATOR*`,
                `━━━━━━━━━━━━━━━━━━━━`,
                ``,
                `  *Simple:*\n  ${prefix}setcmd hello | Hi there! 👋`,
                ``,
                `  *With list:*\n  ${prefix}setcmd rules | type=list | items=Rule 1,Rule 2,Rule 3`,
                ``,
                `  *With image:*\n  ${prefix}setcmd banner | type=image | url=https://example.com/img.jpg`,
                ``,
                `  *Variables:*\n  {user} — sender number\n  {prefix} — bot prefix`,
                ``,
                `━━━━━━━━━━━━━━━━━━━━`,
            ].join('\n'));
        }

        const full = args.join(' ');
        const parts = full.split('|').map(p => p.trim());
        const name = parts[0].toLowerCase().replace(/[^a-z0-9_]/g, '');

        if (!name) return reply(`❌ Invalid command name.`);
        if (name.length > 30) return reply(`❌ Command name too long (max 30 chars).`);

        // Reserved names
        const reserved = ['help', 'menu', 'ping', 'eval', 'shell', 'restart', 'setcmd', 'delcmd', 'listcmd'];
        if (reserved.includes(name)) return reply(`❌ "${name}" is a reserved command name.`);

        const cmds = loadCmds();

        if (parts.length === 1) {
            // Interactive mode - just name provided
            cmds[name] = {
                response: `Custom command "${name}" created by ${sender.split('@')[0]}`,
                author: sender.split('@')[0],
                createdAt: Date.now(),
            };
            saveCmds();
            return reply(`✅ Command *${prefix}${name}* created!\n\nEdit it with:\n${prefix}setcmd ${name} | <new response>`);
        }

        // Parse options
        const options = {};
        for (let i = 1; i < parts.length; i++) {
            const part = parts[i];
            if (part.startsWith('type=')) {
                options.type = part.split('=')[1];
            } else if (part.startsWith('url=')) {
                options.url = part.split('=').slice(1).join('=');
            } else if (part.startsWith('items=')) {
                options.items = part.split('=').slice(1).join('=').split(',').map(s => s.trim());
            } else if (part.startsWith('desc=')) {
                options.description = part.split('=').slice(1).join('=');
            } else if (part.startsWith('role=')) {
                options.role = parseInt(part.split('=')[1]) || 0;
            } else if (part.startsWith('cat=')) {
                options.category = part.split('=')[1];
            } else {
                // Plain response
                options.response = part;
            }
        }

        cmds[name] = {
            response: options.response || null,
            type: options.type || 'text',
            image: options.url && options.type === 'image' ? options.url : null,
            sticker: options.url && options.type === 'sticker' ? options.url : null,
            items: options.items || [],
            description: options.description || `Custom: ${name}`,
            category: options.category || 'general',
            role: options.role || 0,
            author: sender.split('@')[0],
            createdAt: Date.now(),
        };

        saveCmds();

        let text = `━━━━━━━━━━━━━━━━━━━━\n  ✅ *COMMAND CREATED*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
        text += `  📛 Name: *${prefix}${name}*\n`;
        text += `  📝 Type: ${options.type || 'text'}\n`;
        if (options.response) text += `  💬 Response: ${options.response.substring(0, 100)}\n`;
        if (options.items?.length) text += `  📋 Items: ${options.items.length}\n`;
        text += `\n━━━━━━━━━━━━━━━━━━━━`;

        reply(text);
    },
};
