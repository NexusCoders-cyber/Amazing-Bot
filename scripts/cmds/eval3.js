import { isDev } from '../../src/utils/devAccess.js';
import { execSync } from 'child_process';

export default {
    config: {
        name: 'eval2',
        aliases: ['ev', 'js'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Execute JavaScript code (dev only)',
        category: 'owner',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}eval2 <code>' },
    },

    async onStart({ args, reply, sender, message, sock, from, React }) {
        React('⚡');
        if (!isDev(sender)) return reply(`❌ Developer-only command.`);
        if (!args.length) return reply(`Usage: {prefix}eval2 <code>`);

        const code = args.join(' ');
        try {
            const result = await eval(code);
            const output = typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result);
            const truncated = output.length > 3000 ? output.substring(0, 3000) + '\n... (truncated)' : output;
            reply(`✅ *Result:*\n\`\`\`\n${truncated}\n\`\`\``);
        } catch (err) {
            reply(`❌ *Error:*\n\`\`\`\n${err.message}\n\`\`\``);
        }
    },
};
