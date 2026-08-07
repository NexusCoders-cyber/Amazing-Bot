export default {
    config: {
        name: 'poll2',
        aliases: ['quickpoll'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .poll2 <question>nThis posts a simple text-based yes/no prompt (use .pol',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}poll2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .poll2 <question>\nThis posts a simple text-based yes/no prompt (use .polladd for a real WhatsApp poll if that command is available).');
            reply(`📊 *Poll:* ${text}\nReact with 👍 for yes or 👎 for no.`);
        
    },
};
