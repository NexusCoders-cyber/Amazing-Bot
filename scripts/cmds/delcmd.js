import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CMDS_PATH = path.join(__dirname, '../../data/custom_cmds.json');

export default {
    config: {
        name: 'delcmd',
        aliases: ['removecmd', 'deletecmd'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Delete a custom command',
        category: 'owner',
        coolDown: 3,
        role: 2,
        guide: { en: '{prefix}delcmd <name>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('🗑️');
        if (!args.length) return reply(`Usage: ${prefix}delcmd <command name>`);

        const name = args[0].toLowerCase().replace(/[^a-z0-9_]/g, '');
        let cmds = {};
        try { cmds = fs.readJsonSync(CMDS_PATH); } catch { return reply(`❌ No custom commands found.`); }

        if (!cmds[name]) return reply(`❌ Command "${name}" doesn't exist.`);

        delete cmds[name];
        fs.writeJsonSync(CMDS_PATH, cmds, { spaces: 2 });

        reply([
            `━━━━━━━━━━━━━━━━━━━━`,
            `  🗑️ *COMMAND DELETED*`,
            `━━━━━━━━━━━━━━━━━━━━`,
            ``,
            `  📛 Name: *${prefix}${name}*`,
            `  ⚠️ Restart bot to fully unload`,
            ``,
            `━━━━━━━━━━━━━━━━━━━━`,
        ].join('\n'));
    },
};
