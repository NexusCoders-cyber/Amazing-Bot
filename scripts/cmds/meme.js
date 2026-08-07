export default {
    config: {
        name: 'meme',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get random meme',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}meme <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        try { const r = await fetch('https://meme-api.com/gimme'); const d = await r.json(); reply({image: d.url, caption: d.title}); } catch { reply('No memes available right now 😢'); }
    },
};
