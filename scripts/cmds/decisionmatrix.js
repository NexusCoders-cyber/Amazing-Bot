export default {
    config: {
        name: 'decisionmatrix',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .decisionmatrix <option>|<criterion1:score>,<criterion2:score>...nExampl',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}decisionmatrix <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text || !text.includes('|')) return reply('Usage: .decisionmatrix <option>|<criterion1:score>,<criterion2:score>...\nExample: .decisionmatrix Job A|salary:8,growth:6,commute:4\nScores are 1-10. Run once per option and compare totals.');
            const [option, criteriaStr] = text.split('|');
            const criteria = criteriaStr.split(',').map(c => {
                const [name, score] = c.split(':').map(s => s.trim());
                return { name, score: parseFloat(score) };
            }).filter(c => c.name && !isNaN(c.score));
            if (!criteria.length) return reply('Please provide criteria as name:score pairs, e.g. salary:8,growth:6');
            const total = criteria.reduce((s, c) => s + c.score, 0);
            const avg = (total / criteria.length).toFixed(1);
            reply(`📊 *${option.trim()}*\n\n${criteria.map(c => `${c.name}: ${c.score}/10`).join('\n')}\n\nTotal: ${total} | Average: ${avg}/10`);
        
    },
};
