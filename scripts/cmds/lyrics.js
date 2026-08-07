export default {
    config: {
        name: 'lyrics',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Get song lyrics (via API)',
        category: 'fun',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}lyrics <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        try { const r = await fetch(`https://some-random-api.com/lyrics?q=${encodeURIComponent(args.join(' '))}`); const d = await r.json(); reply(`🎵 *${d.title}* by ${d.author}
        
        ${d.lyrics?.substring(0,1900)}`); } catch { reply('❌ Could not find lyrics.'); }
    },
};
