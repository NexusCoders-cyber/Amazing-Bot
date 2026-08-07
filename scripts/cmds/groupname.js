export default {
    config: {
        name: 'groupname',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'This command can only be used in groups.',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}groupname <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!message?.isGroup) return reply('This command can only be used in groups.');
            if (!text) return reply('Usage: .groupname <new name>');
            if (!isAdmins && !isCreator) return reply('Only group admins can use this command.');
            try {
                await King.groupUpdateSubject(from, text);
                reply('✅ Group name updated.');
            } catch (e) {
                reply('Could not update group name.');
            }
        
    },
};
