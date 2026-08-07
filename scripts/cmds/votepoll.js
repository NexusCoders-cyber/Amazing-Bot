export default {
    config: {
        name: 'votepoll',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .votepoll <question>|<option1,option2,option3>nExample: .votepoll Where ',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}votepoll <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .votepoll <question>|<option1,option2,option3>\nExample: .votepoll Where to eat?|Pizza,Sushi,Burgers');
            const [question, optionsStr] = text.split('|');
            if (!optionsStr) return reply('Please provide options separated by commas after a |');
            const options = optionsStr.split(',').map(o => o.trim()).filter(Boolean);
            const data = load(fs, fsx, 'polls.json');
            data[from] = { question: question.trim(), options, votes: {} };
            save(fs, 'polls.json', data);
            reply(`🗳️ *${question.trim()}*\n\n${options.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nVote with .votetally <number>`);
        
    },
};
