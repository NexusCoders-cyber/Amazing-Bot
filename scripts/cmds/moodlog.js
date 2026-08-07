export default {
    config: {
        name: 'moodlog',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .moodlog <${validMoods.join('|')}> [note]',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}moodlog <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const validMoods = ['great', 'good', 'okay', 'bad', 'terrible'];
            const mood = (args[0] || '').toLowerCase();
            if (!validMoods.includes(mood)) return reply(`Usage: .moodlog <${validMoods.join('|')}> [note]`);
            const note = args.slice(1).join(' ');
            const data = load(fs, fsx, 'mood.json');
            if (!data[sender]) data[sender] = [];
            data[sender].push({ mood, note, date: todayStr() });
            save(fs, 'mood.json', data);
            const emojis = { great: '😄', good: '🙂', okay: '😐', bad: '😔', terrible: '😢' };
            reply(`${emojis[mood]} Mood logged: ${mood}${note ? ` — "${note}"` : ''}`);
        
    },
};
