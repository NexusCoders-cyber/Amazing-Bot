export default {
    config: {
        name: 'contactsave',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .contactsave <name> <number>nExample: .contactsave John 08012345678',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}contactsave <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .contactsave <name> <number>\nExample: .contactsave John 08012345678');
            const number = args[args.length - 1];
            const name = args.slice(0, -1).join(' ');
            const data = load(fs, fsx, 'contacts.json');
            if (!data[sender]) data[sender] = {};
            data[sender][name.toLowerCase()] = { name, number };
            save(fs, 'contacts.json', data);
            reply(`📇 Saved: ${name} — ${number}`);
        
    },
};
