import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export default {
    config: {
        name: 'shell',
        aliases: ['sh', '$'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Run shell commands on the server (owner only)',
        category: 'owner',
        coolDown: 0,
        role: 2,
        guide: { en: '{prefix}shell <command>' },
    },
    async onStart({ sock, message, args, from, reply }) {
        const command = args.join(' ').trim();

        if (!command) {
            return reply(
                'Shell guide\n\n' +
                'Usage: shell <command>\n\n' +
                'Examples:\n' +
                'shell ls -la\n' +
                'shell cat package.json\n' +
                'shell npm install axios\n' +
                'shell node -v\n' +
                'shell df -h'
            );
        }

        try {
            const { stdout, stderr } = await execAsync(command, {
                maxBuffer: 1024 * 1024 * 5,
                cwd: process.cwd(),
            });
            const output = (stdout || '').trim() || (stderr || '').trim() || '(no output)';
            const trimmed = output.length > 4000 ? output.slice(0, 4000) + '\n...(truncated)' : output;
            await sock.sendMessage(from, { text: trimmed }, { quoted: message });
        } catch (err) {
            const errMsg = (err.stderr || err.stdout || err.message || '').trim().slice(0, 3000);
            await sock.sendMessage(from, { text: errMsg }, { quoted: message });
        }
    },
};
