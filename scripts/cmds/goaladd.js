export default {
    config: {
        name: 'goaladd',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .goaladd <target_number> <goal name>nExample: .goaladd 10 Read 10 books ',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}goaladd <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .goaladd <target_number> <goal name>\nExample: .goaladd 10 Read 10 books this year');
            const target = parseInt(args[0]);
            if (isNaN(target) || target <= 0) return reply('Please provide a valid positive target number.');
            const name = args.slice(1).join(' ');
            const data = load(fs, fsx, 'goals.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ name, target, progress: 0, done: false });
            save(fs, 'goals.json', data);
            reply(`🎯 Goal added: "${name}" (target: ${target})`);
        
    },
};
