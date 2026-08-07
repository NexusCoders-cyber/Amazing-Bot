export default {
    config: {
        name: 'epochnow',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '⏱️ Current Unix epoch time: *${Math.floor(Date.now() / 1000)}*n(milliseconds: $',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}epochnow <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            reply(`⏱️ Current Unix epoch time: *${Math.floor(Date.now() / 1000)}*\n(milliseconds: ${Date.now()})`);
        
    },
};
