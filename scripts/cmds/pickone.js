export default {
    config: {
        name: 'pickone',
        aliases: ['choose'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .pickone option1, option2, option3',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}pickone <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text || !text.includes(',')) return reply('Usage: .pickone option1, option2, option3');
            const options = text.split(',').map(o => o.trim()).filter(Boolean);
            if (options.length < 2) return reply('Give me at least two options separated by commas.');
            reply(`🎯 I choose: *${options[Math.floor(Math.random() * options.length)]}*`);
        
    },
};
