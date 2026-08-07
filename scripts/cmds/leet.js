export default {
    config: {
        name: 'leet',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .leet <text>',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}leet <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (!text) return reply('Usage: .leet <text>');
            const map = { a: '4', e: '3', i: '1', o: '0', s: '5', t: '7', l: '1', A: '4', E: '3', I: '1', O: '0', S: '5', T: '7', L: '1' };
            reply(text.split('').map(c => map[c] || c).join(''));
        
    },
};
