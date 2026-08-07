import { isDev } from '../../src/utils/devAccess.js';
import fs from 'fs';
import path from 'path';

export default {
    config: {
        name: 'readfile',
        aliases: ['cat', 'rf'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Read file contents (dev only)',
        category: 'owner',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}readfile <path>' },
    },

    async onStart({ args, reply, sender, React }) {
        React('📄');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);
        if (!args.length) return reply(`Usage: {prefix}readfile <path>`);

        const filePath = path.join(process.cwd(), args.join(' '));
        try {
            if (!fs.existsSync(filePath)) return reply(`❌ File not found: ${args.join(' ')}`);
            const content = fs.readFileSync(filePath, 'utf8');
            const truncated = content.length > 3000 ? content.substring(0, 3000) + '\n... (truncated)' : content;
            reply(`📄 *${args.join(' ')}:*\n\`\`\`\n${truncated}\n\`\`\``);
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
