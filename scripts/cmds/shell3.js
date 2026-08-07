import { isDev } from '../../src/utils/devAccess.js';
import { execSync } from 'child_process';

export default {
    config: {
        name: 'shell2',
        aliases: ['sh', 'exec'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Execute shell command (dev only)',
        category: 'owner',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}shell2 <command>' },
    },

    async onStart({ args, reply, sender, React }) {
        React('⚡');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);
        if (!args.length) return reply(`Usage: {prefix}shell2 <command>`);

        const cmd = args.join(' ');
        try {
            const output = execSync(cmd, { timeout: 30000, encoding: 'utf8', maxBuffer: 1024 * 1024 });
            const truncated = output.length > 3000 ? output.substring(0, 3000) + '\n... (truncated)' : output;
            reply(`✅ *Output:*\n\`\`\`\n${truncated}\n\`\`\``);
        } catch (err) {
            reply(`❌ *Error:*\n\`\`\`\n${err.message.substring(0, 2000)}\n\`\`\``);
        }
    },
};
