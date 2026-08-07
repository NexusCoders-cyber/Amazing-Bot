export default {
    config: { name: 'translate3', aliases: ['tr'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Translate text to any language', category: 'utility', coolDown: 5, role: 0, guide: { en: '{prefix}translate <lang> <text>' } },
    async onStart({ args, reply, prefix, React }) {
        React('🌍');
        if (args.length < 2) return reply(`Usage: ${prefix}translate <lang code> <text>\nExample: ${prefix}tr es Hello World`);
        const lang = args[0].toLowerCase(); const text = args.slice(1).join(' ');
        try { const { default: axios } = await import('axios'); const { data } = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`, { timeout: 10000 }); reply(`🌍 *Translation (${lang}):*\n${data[0][0][0]}`); } catch { reply('❌ Translation failed.'); }
    },
};
