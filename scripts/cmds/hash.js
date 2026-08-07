import crypto from 'crypto';

const ALGOS = {
    md5: 'md5',
    sha1: 'sha1',
    sha256: 'sha256',
    sha512: 'sha512',
};

export default {
    config: {
        name: 'hash',
        aliases: ['hashing', 'checksum'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Hash text (md5, sha1, sha256, sha512)',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}hash <algo> <text> | {prefix}hash <text> (defaults sha256)' },
    },
    async onStart({ args, message, reply }) {
        let algo, text;

        if (args.length >= 2 && ALGOS[args[0].toLowerCase()]) {
            algo = args[0].toLowerCase();
            text = args.slice(1).join(' ');
        } else {
            algo = 'sha256';
            text = args.join(' ');
        }

        if (!text) {
            const quoted = message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.conversation
                || message.message?.extendedTextMessage?.contextInfo?.quotedMessage?.extendedTextMessage?.text;
            if (quoted) text = quoted;
        }

        if (!text) return reply('Provide text to hash.\nUsage: hash [algo] <text>');

        const hash = crypto.createHash(ALGOS[algo]).update(text).digest('hex');

        reply([
            `#️⃣ *${algo.toUpperCase()} Hash*`,
            '',
            `\`${hash}\``,
        ].join('\n'));
    },
};
