export default {
    config: {
        name: 'leastactive',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'This command can only be used in groups.',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}leastactive <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!isGroup) return reply('This command can only be used in groups.');
            reply('📉 Activity tracking data isn\'t collected yet for this group. This feature needs a message-logging hook to be enabled first — ask your bot admin to set that up if you want this to work.');
        
    },
};
