import fs from 'fs-extra';
import path from 'path';

const STORE = path.join(process.cwd(), 'data', 'botvars.json');
async function load() { try { return await fs.readJSON(STORE); } catch { return {}; } }
async function save(d) { await fs.ensureDir(path.dirname(STORE)); await fs.writeJSON(STORE, d, { spaces: 2 }); }

export default {
    name: 'setvar',
    aliases: ['sv', 'svar'],
    category: 'owner',
    description: 'Set a persistent bot variable — accessible in eval as global.botVars.key',
    usage: 'setvar <key> <value>',
    example: 'setvar greeting Hello!\nsetvar maxWarn 5\nsetvar apiKey abc123',
    cooldown: 0,
    ownerOnly: true,
    args: true,
    minArgs: 2,

    async execute({ sock, message, args, from }) {
        const key = args[0];
        const value = args.slice(1).join(' ');
        const vars = await load();
        vars[key] = value;
        await save(vars);
        if (!global.botVars) global.botVars = {};
        global.botVars[key] = value;
        await sock.sendMessage(from, {
            text: `✅ *Variable Set*\n\n🔑 Key: \`${key}\`\n📦 Value: \`${value}\`\n\n💡 Access in eval:\n\`global.botVars.${key}\``
        }, { quoted: message });
    }
};
