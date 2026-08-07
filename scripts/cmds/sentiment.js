export default {
    config: {
        name: 'sentiment',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Analyze text sentiment',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}sentiment <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        const text = args.join(' ').toLowerCase(); const pos = ['love','happy','great','amazing','good','awesome','nice','beautiful','perfect','wonderful','fantastic','excellent']; const neg = ['hate','bad','ugly','terrible','worst','horrible','awful','sad','angry','stupid','die','kill']; const p = pos.filter(w=>text.includes(w)).length; const n = neg.filter(w=>text.includes(w)).length; const score = ((p-n+3)/6*100).toFixed(0); reply(`📊 *Sentiment:* ${score}% positive
        ${p>n?'😊 Positive vibes!':n>p?'😞 Negative vibes...':'😐 Neutral'}`);
    },
};
