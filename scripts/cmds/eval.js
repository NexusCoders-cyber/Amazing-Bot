import { inspect } from 'util';

export default {
    config: {
        name: 'eval',
        aliases: ['ev', '>'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Execute JavaScript code (owner only)',
        longDescription: 'Evaluate any JS expression or statement. Has access to sock, message, from, sender, usersData, threadsData, AmazingBot, api.',
        category: 'owner',
        coolDown: 0,
        role: 2,
        guide: { en: '{prefix}eval <js code>' },
    },
    async onStart({ sock, message, args, from, sender, reply, usersData, threadsData, AmazingBot, api }) {
        const code = args.join(' ').trim();

        if (!code) {
            return reply(
                'Eval guide\n\n' +
                'Usage: eval <js code>\n\n' +
                'Available variables:\n' +
                'sock, message, from, sender, api, usersData, threadsData, AmazingBot\n\n' +
                'Examples:\n' +
                'eval sock.user\n' +
                'eval await usersData.get(sender)\n' +
                'eval AmazingBot.onReply.size\n' +
                'eval process.version'
            );
        }

        try {
            let result;
            try {
                result = await eval(`(async () => { return (${code}) })()`);
            } catch {
                result = await eval(`(async () => { ${code} })()`);
            }

            if (result === undefined) result = 'undefined';
            else if (result === null) result = 'null';
            else if (typeof result !== 'string') result = inspect(result, { depth: 4, colors: false });

            if (result.length > 4000) result = result.slice(0, 4000) + '\n...(truncated)';

            await sock.sendMessage(from, { text: result }, { quoted: message });

        } catch (err) {
            await sock.sendMessage(from, { text: `${err.name}: ${err.message}` }, { quoted: message });
        }
    },
};
