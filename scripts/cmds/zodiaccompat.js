export default {
    config: {
        name: 'zodiaccompat',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .zodiaccompat <sign1> <sign2>nExample: .zodiaccompat leo aries',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}zodiaccompat <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .zodiaccompat <sign1> <sign2>\nExample: .zodiaccompat leo aries');
            const combined = args[0].toLowerCase() + args[1].toLowerCase();
            let hash = 0;
            for (let i = 0; i < combined.length; i++) hash = (hash * 31 + combined.charCodeAt(i)) >>> 0;
            const pct = hash % 101;
            reply(`💫 *${args[0]}* + *${args[1]}* compatibility: *${pct}%*`);
        
    },
};
