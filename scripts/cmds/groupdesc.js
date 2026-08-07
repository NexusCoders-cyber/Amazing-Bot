export default {
    config: {
        name: 'groupdesc',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'This command can only be used in groups.',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}groupdesc <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!message?.isGroup) return reply('This command can only be used in groups.');
            if (!text) return reply('Usage: .groupdesc <new description>');
            if (!isAdmins && !isCreator) return reply('Only group admins can use this command.');
            try {
                await King.groupUpdateDescription(from, text);
                reply('✅ Group description updated.');
            } catch (e) {
                reply('Could not update group description.');
            }
        
    },
};
