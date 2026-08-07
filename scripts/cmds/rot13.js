export default {
    config: {
        name: 'rot13',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .rot13 <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}rot13 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .rot13 <text>');
            const out = text.replace(/[a-zA-Z]/g, c => {
                const base = c <= 'Z' ? 65 : 97;
                return String.fromCharCode((c.charCodeAt(0) - base + 13) % 26 + base);
            });
            reply(out);
        
    },
};
