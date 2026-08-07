import crypto from 'crypto';

export default {
    config: {
        name: 'password',
        aliases: ['pass', 'genpass', 'randompass'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Generate a secure random password',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}password [length] [count]' },
    },
    async onStart({ args, reply }) {
        const length = Math.min(Math.max(parseInt(args[0]) || 16, 4), 64);
        const count = Math.min(Math.max(parseInt(args[1]) || 1, 1), 5);

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*_-';

        const passwords = Array.from({ length: count }, () => {
            const bytes = crypto.randomBytes(length);
            return Array.from(bytes, b => chars[b % chars.length]).join('');
        });

        reply([
            `🔑 *Generated Password${count > 1 ? 's' : ''}*`,
            '',
            ...passwords.map((p, i) => `${i + 1}. \`${p}\``),
            '',
            `Length: ${length} chars`,
        ].join('\n'));
    },
};
