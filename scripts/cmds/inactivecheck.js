export default {
    config: {
        name: 'inactivecheck',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'This command can only be used in groups.',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}inactivecheck <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!message?.isGroup) return reply('This command can only be used in groups.');
            reply(`ℹ️ This group has ${participants.length} members. WhatsApp does not expose last-seen/activity data through the bot API, so a true inactivity report isn't possible — this command lists total member count only.`);
        
    },
};
