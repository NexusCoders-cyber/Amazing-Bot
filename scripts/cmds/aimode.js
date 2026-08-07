export default {
    config: {
        name: 'aimode',
        aliases: ['aichat'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Only group admins or the bot owner can toggle AI mode in a group.',
        category: 'ai',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}aimode <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
    
        if (isGroup && !isAdmins && !isCreator) return reply('Only group admins or the bot owner can toggle AI mode in a group.');
        const settings = loadSettings();
        const sub = (args[0] || '').toLowerCase();
        if (sub === 'on') {
            settings[from] = true;
            saveSettings(settings);
            return reply('🤖 *AI mode is ON* for this chat.\n\nTalk to me normally — no prefix needed. I can:\n• Answer real questions properly, not just one-liners\n• Generate images from a description ("draw me a cyberpunk city")\n• Run quick utilities along the way (weather, currency, jokes, coin flips, etc.)\n• Just chat normally otherwise\n\nTurn it off anytime with .aimode off');
        }
        if (sub === 'off') {
            settings[from] = false;
            saveSettings(settings);
            return reply('AI mode is now OFF. Back to normal — commands need the prefix again.');
        }
        reply(`AI mode is currently *${settings[from] ? 'ON ✅' : 'OFF ❌'}* in this chat.\nUsage: .aimode on | .aimode off`);
    
    },
};
