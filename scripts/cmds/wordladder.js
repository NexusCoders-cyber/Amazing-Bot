export default {
    config: {
        name: 'wordladder',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .wordladder <word>nBuilds a growing ladder from your word.',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}wordladder <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const word = args[0];
            if (!word) return reply('Usage: .wordladder <word>\nBuilds a growing ladder from your word.');
            let out = [];
            for (let i = 1; i <= word.length; i++) out.push(word.slice(0, i));
            reply(out.join('\n'));
        
    },
};
