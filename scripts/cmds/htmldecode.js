export default {
    config: {
        name: 'htmldecode',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .htmldecode <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}htmldecode <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .htmldecode <text>');
            const map = { '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'" };
            reply(text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, m => map[m]));
        
    },
};
