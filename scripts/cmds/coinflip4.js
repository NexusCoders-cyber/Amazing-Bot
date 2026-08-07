export default {
    config: {
        name: 'coinflip4',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Flip N coins',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}coinflip4' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const n = Math.min(parseInt(args[0])||1, 10); const results = Array.from({length:n}, ()=>Math.random()>0.5?'Heads 🪙':'Tails 🪙'); const h = results.filter(r=>r.includes('Heads')).length; reply(`${results.join('\n')}\n\nHeads: ${h} | Tails: ${n-h}`);
    },
};
