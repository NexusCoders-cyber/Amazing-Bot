export default {
    config: {
        name: 'votetally',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No active poll. Start one with .votepoll <question>|<options>',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}votetally <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'polls.json');
            const poll = data[from];
            if (!poll) return reply('No active poll. Start one with .votepoll <question>|<options>');
            const choice = parseInt(args[0]) - 1;
            if (isNaN(choice) || !poll.options[choice]) {
                const counts = poll.options.map((o, i) => `${i + 1}. ${o}: ${Object.values(poll.votes).filter(v => v === i).length} vote(s)`).join('\n');
                return reply(`🗳️ *${poll.question}*\n\n${counts}\n\nVote with .votetally <number>`);
            }
            poll.votes[sender] = choice;
            save(fs, 'polls.json', data);
            reply(`✅ Vote recorded for "${poll.options[choice]}"`);
        
    },
};
