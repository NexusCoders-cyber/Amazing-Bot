import { isDev } from '../../src/utils/devAccess.js';
import fs from 'fs';
import path from 'path';

export default {
    config: {
        name: 'setvar',
        aliases: ['setenv'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Set environment variable (dev only)',
        category: 'owner',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}setvar <KEY>=<VALUE>' },
    },

    async onStart({ args, reply, sender, React }) {
        React('🔧');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);
        if (!args.length) return reply(`Usage: {prefix}setvar KEY=VALUE`);

        const input = args.join(' ');
        const eqIdx = input.indexOf('=');
        if (eqIdx === -1) return reply(`Usage: {prefix}setvar KEY=VALUE`);

        const key = input.substring(0, eqIdx).trim();
        const value = input.substring(eqIdx + 1).trim();

        if (!key) return reply(`❌ Invalid key.`);

        try {
            // Set in process.env
            process.env[key] = value;

            // Update .env file
            const envPath = path.join(process.cwd(), '.env');
            let envContent = '';
            if (fs.existsSync(envPath)) {
                envContent = fs.readFileSync(envPath, 'utf8');
            }

            const regex = new RegExp(`^${key}=.*$`, 'm');
            if (regex.test(envContent)) {
                envContent = envContent.replace(regex, `${key}=${value}`);
            } else {
                envContent += `\n${key}=${value}`;
            }

            fs.writeFileSync(envPath, envContent.trim() + '\n');

            reply([
                `━━━━━━━━━━━━━━━━━━━━`,
                `  ✅ *ENV UPDATED*`,
                `━━━━━━━━━━━━━━━━━━━━`,
                ``,
                `  🔑 Key: *${key}*`,
                `  📝 Value: *${value.substring(0, 50)}${value.length > 50 ? '...' : ''}*`,
                `  ⚠️ Some vars require restart`,
                ``,
                `━━━━━━━━━━━━━━━━━━━━`,
            ].join('\n'));
        } catch (err) {
            reply(`❌ Error: ${err.message}`);
        }
    },
};
