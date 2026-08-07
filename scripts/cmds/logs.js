import { isDev } from '../../src/utils/devAccess.js';
import fs from 'fs';
import path from 'path';

export default {
    config: {
        name: 'logs',
        aliases: ['getlogs', 'log'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'View recent bot logs (dev only)',
        category: 'owner',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}logs [lines]' },
    },

    async onStart({ args, reply, sender, React }) {
        React('📜');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);

        const lines = Math.min(parseInt(args[0]) || 30, 100);

        try {
            const logDir = path.join(process.cwd(), 'logs');
            if (!fs.existsSync(logDir)) return reply(`No logs directory found.`);

            const logFiles = fs.readdirSync(logDir).filter(f => f.endsWith('.log')).sort().reverse();
            if (!logFiles.length) return reply(`No log files found.`);

            const latestLog = path.join(logDir, logFiles[0]);
            const content = fs.readFileSync(latestLog, 'utf8');
            const logLines = content.split('\n').filter(Boolean).slice(-lines);

            let text = `━━━━━━━━━━━━━━━━━━━━\n  📜 *LOGS (${logFiles[0]})*\n━━━━━━━━━━━━━━━━━━━━\n\n`;
            text += `\`\`\`\n${logLines.join('\n')}\n\`\`\``;
            text += `\n━━━━━━━━━━━━━━━━━━━━`;

            reply(text);
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
