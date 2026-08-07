export default {
    config: {
        name: 'age2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Calculate age from birthday',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}age2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const b = new Date(args[0]); if(isNaN(b)) return reply('Usage: .age YYYY-MM-DD'); const now = new Date(); let y = now.getFullYear()-b.getFullYear(); if(now.getMonth()<b.getMonth()||(now.getMonth()===b.getMonth()&&now.getDate()<b.getDate()))y--; reply(`🎂 You are *${y}* years old`);
    },
};
