export default {
    config: {
        name: 'wordfreq',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .wordfreq <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}wordfreq <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .wordfreq <text>');
            const words = text.toLowerCase().match(/[a-z0-9']+/g) || [];
            const freq = {};
            words.forEach(w => freq[w] = (freq[w] || 0) + 1);
            const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
            reply('📊 *Top word frequencies:*\n' + sorted.map(([w, c]) => `${w}: ${c}`).join('\n'));
        
    },
};
