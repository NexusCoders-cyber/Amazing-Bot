export default {
    config: {
        name: 'stepgoal',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Please provide a valid positive number.',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}stepgoal <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'stepgoal.json');
            if (!args.length) {
                const goal = data[sender]?.goal;
                return reply(goal ? `🚶 Your daily step goal: *${goal}*` : 'No step goal set. Usage: .stepgoal <number>\nExample: .stepgoal 10000');
            }
            const goal = parseInt(args[0]);
            if (isNaN(goal) || goal <= 0) return reply('Please provide a valid positive number.');
            data[sender] = { goal };
            save(fs, 'stepgoal.json', data);
            reply(`🚶 Daily step goal set to *${goal}*.`);
        
    },
};
