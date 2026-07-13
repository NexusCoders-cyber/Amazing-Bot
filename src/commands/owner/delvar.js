import fs from 'fs-extra';
import path from 'path';

const STORE = path.join(process.cwd(), 'data', 'botvars.json');
async function load() { try { return await fs.readJSON(STORE); } catch { return {}; } }
async function save(d) { await fs.ensureDir(path.dirname(STORE)); await fs.writeJSON(STORE, d, { spaces: 2 }); }

export default {
    name: 'delvar',
    aliases: ['dv', 'deletevar', 'rmvar'],
    category: 'owner',
    description: 'Delete a stored bot variable',
    usage: 'delvar <key|--all>',
    example: 'delvar greeting\ndelvar --all',
    cooldown: 0,
    ownerOnly: true,
    args: true,
    minArgs: 1,

    async execute({ sock, message, args, from }) {
        const key = args[0];
        if (key === '--all' || key === 'all') {
            await save({});
            global.botVars = {};
            return sock.sendMessage(from, { text: '🗑️ All bot variables have been cleared.' }, { quoted: message });
        }
        const vars = await load();
        if (!(key in vars)) {
            return sock.sendMessage(from, { text: `❌ Variable \`${key}\` not found.` }, { quoted: message });
        }
        delete vars[key];
        await save(vars);
        if (global.botVars) delete global.botVars[key];
        await sock.sendMessage(from, { text: `🗑️ Variable \`${key}\` has been deleted.` }, { quoted: message });
    }
};
