const ANSWERS = [
    'It is certain.', 'It is decidedly so.', 'Without a doubt.',
    'Yes — definitely.', 'You may rely on it.', 'As I see it, yes.',
    'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.',
    'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.',
    'Cannot predict now.', 'Concentrate and ask again.',
    'Don\'t count on it.', 'My reply is no.', 'My sources say no.',
    'Outlook not so good.', 'Very doubtful.',
];

export default {
    config: {
        name: '8ball',
        aliases: ['eightball', 'magic8ball'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Magic 8-Ball — ask a yes/no question',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}8ball <your question>' },
    },
    async onStart({ args, reply }) {
        if (!args.length) return reply('🎱 Ask a yes/no question!');
        const answer = ANSWERS[Math.floor(Math.random() * ANSWERS.length)];
        reply(`🎱 *Magic 8-Ball*\n\n_Question: ${args.join(' ')}_\n\n*${answer}*`);
    },
};
