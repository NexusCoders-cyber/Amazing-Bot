export default {
    config: {
        name: 'emergencycontact',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .emergencycontact <name> <number>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}emergencycontact <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'emergency.json');
            if (!text) {
                const ec = data[sender];
                return reply(ec ? `🚨 Emergency contact: ${ec.name} — ${ec.number}` : 'No emergency contact set. Usage: .emergencycontact <name> <number>');
            }
            if (args.length < 2) return reply('Usage: .emergencycontact <name> <number>');
            const number = args[args.length - 1];
            const name = args.slice(0, -1).join(' ');
            data[sender] = { name, number };
            save(fs, 'emergency.json', data);
            reply(`🚨 Emergency contact saved: ${name} — ${number}`);
        
    },
};
