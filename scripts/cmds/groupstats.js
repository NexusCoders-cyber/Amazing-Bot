export default {
    config: {
        name: 'groupstats',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'This command can only be used in groups.',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}groupstats <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!isGroup) return reply('This command can only be used in groups.');
            const total = groupMetadata.participants.length;
            const admins = groupMetadata.participants.filter(p => p.admin).length;
            reply(`📊 *Group Stats*\n\nTotal members: ${total}\nAdmins: ${admins}\nRegular members: ${total - admins}\nCreated: ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}`);
        
    },
};
