export default {
    config: {
        name: 'categoryquiz',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🎯 *${pick.name}*: ${pick.example}',
        category: 'games',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}categoryquiz <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const categories = [
                { name: 'Animals', example: 'Name an animal starting with the letter T.' },
                { name: 'Countries', example: 'Name a country starting with the letter B.' },
                { name: 'Foods', example: 'Name a food starting with the letter P.' },
                { name: 'Movies', example: 'Name a movie starting with the letter S.' }
            ];
            const pick = categories[Math.floor(Math.random() * categories.length)];
            reply(`🎯 *${pick.name}*: ${pick.example}`);
        
    },
};
