export default {
    config: {
        name: 'focusmode',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: '🔕 Focus mode ON. Logged for your own tracking — pair this with muting notificat',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}focusmode <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'focusmode.json');
            const sub = (args[0] || '').toLowerCase();
            if (sub === 'on') {
                data[sender] = { active: true, since: Date.now() };
                save(fs, 'focusmode.json', data);
                return reply('🔕 Focus mode ON. Logged for your own tracking — pair this with muting notifications on your phone.');
            }
            if (sub === 'off') {
                const session = data[sender];
                const duration = session?.active ? Math.round((Date.now() - session.since) / 60000) : 0;
                data[sender] = { active: false };
                save(fs, 'focusmode.json', data);
                return reply(`✅ Focus mode OFF.${duration ? ` You focused for ~${duration} minutes.` : ''}`);
            }
            reply(`Focus mode is currently ${data[sender]?.active ? 'ON 🔕' : 'OFF'}.\nUsage: .focusmode on | .focusmode off`);
        
    },
};
