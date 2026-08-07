export default {
    config: {
        name: 'revokelink',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'This command can only be used in groups.',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}revokelink <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!message?.isGroup) return reply('This command can only be used in groups.');
            if (!isAdmins && !isCreator) return reply('Only group admins can use this command.');
            try {
                await King.groupRevokeInvite(from);
                reply('🔄 Group invite link has been reset.');
            } catch (e) {
                reply('Could not revoke the invite link.');
            }
        
    },
};
