const activeVotes = new Map();

export default {
    config: {
        name: 'vote',
        aliases: ['poll', 'createvote'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Create a poll/vote',
        category: 'fun',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}vote <question> | option1 | option2 | ...' },
    },
    async onStart({ args, from, sender, reply, sock, message }) {
        const sub = (args[0] || '').toLowerCase();

        // Vote on existing poll
        if (/^\d+$/.test(sub) && activeVotes.has(from)) {
            const poll = activeVotes.get(from);
            const idx = parseInt(sub) - 1;
            if (idx < 0 || idx >= poll.options.length) return reply(`Pick a number between 1 and ${poll.options.length}`);
            if (poll.voters.has(sender)) return reply('You already voted!');
            poll.voters.add(sender);
            poll.counts[idx] = (poll.counts[idx] || 0) + 1;
            return reply(`✅ Voted for: *${poll.options[idx]}*\nTotal votes: ${poll.voters.size}`);
        }

        // End poll
        if (sub === 'end' && activeVotes.has(from)) {
            const poll = activeVotes.get(from);
            if (poll.creator !== sender) return reply('Only the poll creator can end it.');
            const results = poll.options.map((o, i) => `${o}: ${poll.counts[i] || 0} votes`).join('\n');
            activeVotes.delete(from);
            return reply(`📊 *Poll ended: ${poll.question}*\n\n${results}`);
        }

        // Create poll
        const raw = args.join(' ');
        const parts = raw.split('|').map(s => s.trim());
        if (parts.length < 3) return reply('Usage: vote <question> | option1 | option2 | ...\nMinimum 2 options.');

        const question = parts[0];
        const options = parts.slice(1, 8); // max 8 options

        activeVotes.set(from, {
            question,
            options,
            counts: new Array(options.length).fill(0),
            voters: new Set(),
            creator: sender,
        });

        const optionList = options.map((o, i) => `  ${i + 1}. ${o}`).join('\n');

        await sock.sendMessage(from, {
            text: [
                `📊 *POLL: ${question}*`,
                '',
                optionList,
                '',
                `Reply with ${prefix}vote <number> to vote`,
                `Poll creator: ${prefix}vote end`,
            ].join('\n'),
        }, { quoted: message });
    },
};
