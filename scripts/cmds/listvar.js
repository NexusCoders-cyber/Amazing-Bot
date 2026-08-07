import { isDev } from '../../src/utils/devAccess.js';
import fs from 'fs';
import path from 'path';

export default {
    config: {
        name: 'listvar',
        aliases: ['listenv', 'envs'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'List environment variables (dev only)',
        category: 'owner',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}listvar' },
    },

    async onStart({ reply, sender, React }) {
        React('📋');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);

        try {
            const envPath = path.join(process.cwd(), '.env');
            if (!fs.existsSync(envPath)) return reply(`❌ No .env file found.`);

            const content = fs.readFileSync(envPath, 'utf8');
            const lines = content.split('\n').filter(l => l.trim() && !l.startsWith('#'));

            let text = `━━━━━━━━━━━━━━━━━━━━\n  📋 *ENV VARIABLES*\n━━━━━━━━━━━━━━━━━━━━\n\n`;

            for (const line of lines) {
                const eqIdx = line.indexOf('=');
                if (eqIdx === -1) continue;
                const key = line.substring(0, eqIdx).trim();
                const value = line.substring(eqIdx + 1).trim();
                const masked = key.includes('KEY') || key.includes('TOKEN') || key.includes('SECRET') || key.includes('PASSWORD')
                    ? value.substring(0, 4) + '••••••••'
                    : value.substring(0, 30) + (value.length > 30 ? '...' : '');
                text += `  🔑 ${key} = ${masked}\n`;
            }

            text += `\n━━━━━━━━━━━━━━━━━━━━`;
            reply(text);
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
