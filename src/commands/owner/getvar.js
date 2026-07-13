import fs from 'fs-extra';
import path from 'path';

const STORE = path.join(process.cwd(), 'data', 'botvars.json');
async function load() { try { return await fs.readJSON(STORE); } catch { return {}; } }

export default {
    name: 'getvar',
    aliases: ['gv', 'vars', 'listvars'],
    category: 'owner',
    description: 'Get or list all stored persistent bot variables',
    usage: 'getvar [key]',
    example: 'getvar\ngetvar greeting',
    cooldown: 0,
    ownerOnly: true,
    args: false,

    async execute({ sock, message, args, from, prefix }) {
        const vars = await load();
        const key = args[0];
        if (key) {
            if (!(key in vars)) {
                return sock.sendMessage(from, {
                    text: `❌ Variable \`${key}\` not found.\n\nUse ${prefix}getvar to list all variables.`
                }, { quoted: message });
            }
            return sock.sendMessage(from, {
                text: `🔑 *${key}*\n\`\`\`\n${vars[key]}\n\`\`\``
            }, { quoted: message });
        }
        const keys = Object.keys(vars);
        if (!keys.length) {
            return sock.sendMessage(from, {
                text: `📭 No variables stored yet.\n\nUse ${prefix}setvar <key> <value> to add one.`
            }, { quoted: message });
        }
        const list = keys.map((k, i) => {
            const val = String(vars[k]);
            return `${i + 1}. \`${k}\` = ${val.length > 50 ? val.slice(0, 50) + '…' : val}`;
        }).join('\n');
        await sock.sendMessage(from, {
            text: `📦 *Bot Variables (${keys.length})*\n\n${list}\n\n💡 Use ${prefix}getvar <key> for full value`
        }, { quoted: message });
    }
};
