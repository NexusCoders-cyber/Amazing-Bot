export default {
    config: {
        name: 'contactlist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No saved contacts. Add one with .contactsave <name> <number>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}contactlist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'contacts.json');
            const contacts = Object.values(data[sender] || {});
            if (!contacts.length) return reply('No saved contacts. Add one with .contactsave <name> <number>');
            reply(`📇 *Your Contacts*\n\n${contacts.map(c => `${c.name}: ${c.number}`).join('\n')}`);
        
    },
};
