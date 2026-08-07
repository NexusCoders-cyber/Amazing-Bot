export default {
    config: {
        name: 'moodhistory',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No mood entries yet. Log one with .moodlog <great|good|okay|bad|terrible>',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}moodhistory <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'mood.json');
            const entries = (data[sender] || []).slice(-7);
            if (!entries.length) return reply('No mood entries yet. Log one with .moodlog <great|good|okay|bad|terrible>');
            const emojis = { great: '😄', good: '🙂', okay: '😐', bad: '😔', terrible: '😢' };
            const out = entries.map(e => `${e.date}: ${emojis[e.mood]} ${e.mood}${e.note ? ` — ${e.note}` : ''}`).join('\n');
            reply(`📊 *Last 7 Mood Entries*\n\n${out}`);
        
    },
};
