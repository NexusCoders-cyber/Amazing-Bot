export default {
    config: { name: 'lyrics2', aliases: ['lyric'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Search song lyrics (v2)', category: 'utility', coolDown: 10, role: 0, guide: { en: '{prefix}lyrics2 <song name>' } },
    async onStart({ args, reply, prefix, React }) {
        React('🎵');
        if (!args.length) return reply(`Usage: ${prefix}lyrics2 <song name>`);
        const q = args.join(' ');
        try { const { default: axios } = await import('axios'); const { data } = await axios.get(`https://some-random-api.com/lyrics?q=${encodeURIComponent(q)}`, { timeout: 10000 }); reply(`🎵 *${data.title}* — ${data.author}\n\n${data.lyrics?.substring(0, 1900) || 'No lyrics found'}`); } catch { reply(`❌ Could not find lyrics for "${q}"`); }
    },
};
