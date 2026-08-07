export default {
    config: {
        name: 'emailtemplate',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .emailtemplate <type> [recipient name]nTypes: ${Object.keys(templates).j',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}emailtemplate <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            const templates = {
                leave: (who) => `Subject: Leave Request\n\nHi [Manager],\n\nI'd like to request leave from [start date] to [end date] for ${who || '[reason]'}. I'll ensure my work is handed over before I go. Let me know if this works.\n\nThanks,\n[Your name]`,
                meeting: (who) => `Subject: Meeting Request\n\nHi ${who || '[Name]'},\n\nCould we set up a time to discuss [topic]? I'm free [availability] — let me know what works for you.\n\nBest,\n[Your name]`,
                apology: (who) => `Subject: Apology\n\nHi ${who || '[Name]'},\n\nI wanted to apologize for [what happened]. That wasn't intentional, and I understand the impact it had. I'll make sure to [corrective action] going forward.\n\nBest,\n[Your name]`,
                thanks: (who) => `Subject: Thank You\n\nHi ${who || '[Name]'},\n\nThank you so much for [what they did] — it really made a difference. I appreciate you taking the time.\n\nBest,\n[Your name]`,
                followup: (who) => `Subject: Following Up\n\nHi ${who || '[Name]'},\n\nJust following up on my earlier message about [topic] — wanted to check if you had any thoughts. No rush, just keeping it on your radar.\n\nBest,\n[Your name]`
            };
            const type = (args[0] || '').toLowerCase();
            if (!templates[type]) return reply(`Usage: .emailtemplate <type> [recipient name]\nTypes: ${Object.keys(templates).join(', ')}`);
            const who = args.slice(1).join(' ');
            reply(`✉️ *${type} template:*\n\n${templates[type](who)}`);
        
    },
};
