export default {
    config: {
        name: 'weeklyplanner',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🗓️ *Weekly Plan*nn${out}nnAdd with .weeklyplanner <day> <item>nExample: .w',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}weeklyplanner <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
            const data = load(fs, fsx, 'weeklyplan.json');
            if (!args.length) {
                const plan = data[sender] || {};
                const out = days.map(d => `${d.toUpperCase()}: ${(plan[d] || []).join(', ') || '-'}`).join('\n');
                return reply(`🗓️ *Weekly Plan*\n\n${out}\n\nAdd with .weeklyplanner <day> <item>\nExample: .weeklyplanner mon Gym at 6am`);
            }
            const day = args[0].toLowerCase().slice(0, 3);
            if (!days.includes(day)) return reply('Please use a day like: sun, mon, tue, wed, thu, fri, sat');
            const item = args.slice(1).join(' ');
            if (!item) return reply('Usage: .weeklyplanner <day> <item>');
            if (!data[sender]) data[sender] = {};
            if (!data[sender][day]) data[sender][day] = [];
            data[sender][day].push(item);
            save(fs, 'weeklyplan.json', data);
            reply(`✅ Added to ${day.toUpperCase()}: "${item}"`);
        
    },
};
