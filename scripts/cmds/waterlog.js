export default {
    config: {
        name: 'waterlog',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '💧 Logged ${amount}ml. Today's total: *${data[sender][today]}ml*',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}waterlog <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const amount = parseInt(args[0]) || 250;
            const data = load(fs, fsx, 'water.json');
            if (!data[sender]) data[sender] = {};
            const today = todayStr();
            data[sender][today] = (data[sender][today] || 0) + amount;
            save(fs, 'water.json', data);
            reply(`💧 Logged ${amount}ml. Today's total: *${data[sender][today]}ml*`);
        
    },
};
