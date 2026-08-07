export default {
    config: {
        name: 'meetingagenda',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .meetingagenda <topic1,topic2,topic3>nExample: .meetingagenda Q3 review,',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}meetingagenda <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .meetingagenda <topic1,topic2,topic3>\nExample: .meetingagenda Q3 review,budget planning,next steps');
            const topics = text.split(',').map(t => t.trim()).filter(Boolean);
            const out = topics.map((t, i) => `${i + 1}. ${t} (___ min)`).join('\n');
            reply(`📋 *Meeting Agenda*\n\n${out}\n\nAction items:\n- \n- \n\nNext meeting: ___`);
        
    },
};
