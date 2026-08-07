export default {
    config: {
        name: 'charcode',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .charcode <single character>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}charcode <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const char = args[0];
            if (!char || char.length !== 1) return reply('Usage: .charcode <single character>');
            reply(`🔢 "${char}" = ${char.charCodeAt(0)}`);
        
    },
};
