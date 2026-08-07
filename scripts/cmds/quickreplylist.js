export default {
    config: {
        name: 'quickreplylist',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'No quick replies saved. Add one with .quickreplysave <shortcut> <message>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}quickreplylist <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const data = load(fs, fsx, 'quickreplies.json');
            const replies = data[sender] || {};
            const keys = Object.keys(replies);
            if (!keys.length) return reply('No quick replies saved. Add one with .quickreplysave <shortcut> <message>');
            reply(`💬 *Your Quick Replies*\n\n${keys.map(k => `${k}: "${replies[k]}"`).join('\n')}\n\nUse one with .quickreplyuse <shortcut>`);
        
    },
};
