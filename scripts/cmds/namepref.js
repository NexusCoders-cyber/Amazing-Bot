export default {
    config: {
        name: 'namepref',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '✅ Got it, I'll call you *${text}* from now on.',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}namepref <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'preferences.json');
            if (!text) {
                const current = data[sender]?.preferredName;
                return reply(current ? `I'll call you *${current}*.` : 'No preferred name set. Usage: .namepref <name>');
            }
            if (!data[sender]) data[sender] = {};
            data[sender].preferredName = text;
            save(fs, 'preferences.json', data);
            reply(`✅ Got it, I'll call you *${text}* from now on.`);
        
    },
};
