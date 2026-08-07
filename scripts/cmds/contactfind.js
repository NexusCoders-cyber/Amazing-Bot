export default {
    config: {
        name: 'contactfind',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .contactfind <name>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}contactfind <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .contactfind <name>');
            const data = load(fs, fsx, 'contacts.json');
            const contacts = data[sender] || {};
            const match = contacts[text.toLowerCase()] || Object.values(contacts).find(c => c.name.toLowerCase().includes(text.toLowerCase()));
            if (!match) return reply(`No contact found matching "${text}".`);
            reply(`📇 ${match.name}: ${match.number}`);
        
    },
};
