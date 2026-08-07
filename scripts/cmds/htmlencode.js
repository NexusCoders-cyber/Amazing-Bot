export default {
    config: {
        name: 'htmlencode',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .htmlencode <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}htmlencode <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .htmlencode <text>');
            const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
            reply(text.replace(/[&<>"']/g, c => map[c]));
        
    },
};
