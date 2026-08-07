import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CMDS_PATH = path.join(__dirname, '../../data/custom_cmds.json');

export default {
    config: {
        name: 'listcmd',
        aliases: ['cmds', 'customcmds'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'List all custom commands',
        category: 'owner',
        coolDown: 5,
        role: 2,
        guide: { en: '{prefix}listcmd' },
    },

    async onStart({ reply, prefix, React }) {
        React('📋');
        let cmds = {};
        try { cmds = fs.readJsonSync(CMDS_PATH); } catch {}

        const entries = Object.entries(cmds);
        if (!entries.length) return reply(`📋 No custom commands yet.\n\nCreate one with: ${prefix}setcmd <name> | <response>`);

        let text = `━━━━━━━━━━━━━━━━━━━━\n  📋 *CUSTOM COMMANDS*\n━━━━━━━━━━━━━━━━━━━━\n\n`;

        for (const [name, data] of entries) {
            text += `  ◆ ${prefix}${name}`;
            if (data.description) text += ` — ${data.description}`;
            text += `\n`;
            if (data.response) text += `    _${data.response.substring(0, 60)}${data.response.length > 60 ? '...' : ''}_\n`;
            text += `    👤 ${data.author || 'Unknown'} | ${data.type || 'text'}\n\n`;
        }

        text += `━━━━━━━━━━━━━━━━━━━━\n  📊 ${entries.length} custom commands\n━━━━━━━━━━━━━━━━━━━━`;

        reply(text);
    },
};
