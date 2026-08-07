export default {
    config: {
        name: 'welcomecard',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'This command can only be used in groups.',
        category: 'admin',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}welcomecard <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!isGroup) return reply('This command can only be used in groups.');
            if (!isAdmins && !isCreator) return reply('Only group admins can set this.');
            const settingPath = './database/settings.json';
            let settings = fsx.existsSync(settingPath) ? JSON.parse(fs.readFileSync(settingPath)) : {};
            if (!settings[from]) settings[from] = {};
            const text = args.join(' ');
            if (!text) {
                const current = settings[from].welcomeText;
                return reply(current ? `Current welcome message:\n"${current}"\n\nUse {user} to insert the new member's name.` : 'No custom welcome message set. Usage: .welcomecard Welcome {user} to the group!');
            }
            settings[from].welcomeText = text;
            fs.writeFileSync(settingPath, JSON.stringify(settings, null, 2));
            reply(`✅ Welcome message updated:\n"${text}"`);
        
    },
};
