export default {
    config: {
        name: 'dailyplanner',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No plan for today yet. Add items with .dailyplanner <item>nExample: .dailyplann',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}dailyplanner <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'dailyplan.json');
            const today = new Date().toISOString().slice(0, 10);
            if (!text) {
                const plan = data[sender]?.[today];
                if (!plan || !plan.length) return reply(`No plan for today yet. Add items with .dailyplanner <item>\nExample: .dailyplanner 9am standup meeting`);
                return reply(`📆 *Today's Plan (${today})*\n\n${plan.map((p, i) => `${i + 1}. ${p}`).join('\n')}`);
            }
            if (!data[sender]) data[sender] = {};
            if (!data[sender][today]) data[sender][today] = [];
            data[sender][today].push(text);
            save(fs, 'dailyplan.json', data);
            reply(`✅ Added to today's plan: "${text}"`);
        
    },
};
