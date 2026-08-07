export default {
    config: {
        name: 'chorelist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🎉 No pending chores! Add one with .choreadd <chore>',
        category: 'general',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}chorelist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const key = isGroup ? from : sender;
            const data = load(fs, fsx, 'chores.json');
            const chores = data[key] || [];
            const pending = chores.map((c, i) => ({ ...c, idx: i })).filter(c => !c.done);
            if (!pending.length) return reply('🎉 No pending chores! Add one with .choreadd <chore>');
            reply(`🧹 *Chores*\n\n${pending.map(c => `${c.idx + 1}. ${c.text}${c.assignedTo ? ` (@${c.assignedTo.split('@')[0]})` : ''}`).join('\n')}\n\nMark done with .chorecomplete <number>`);
        
    },
};
