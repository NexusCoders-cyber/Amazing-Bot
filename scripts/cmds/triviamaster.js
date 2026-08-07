export default {
    config: {
        name: 'triviamaster',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🎓 *${decode(q.category)}* (${q.difficulty})n${decode(q.question)}nn${options',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}triviamaster <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            try {
                const { data } = await axios.get('https://opentdb.com/api.php?amount=1&type=multiple');
                const q = data.results[0];
                const decode = s => s.replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&');
                const options = [...q.incorrect_answers.map(decode), decode(q.correct_answer)].sort(() => Math.random() - 0.5);
                reply(`🎓 *${decode(q.category)}* (${q.difficulty})\n${decode(q.question)}\n\n${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}`);
            } catch (e) {
                reply('Could not fetch a trivia question right now.');
            }
        
    },
};
