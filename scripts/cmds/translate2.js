import axios from 'axios';
export default {
    config: {
        name: 'translate2',
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Usage: .translate2 <target_lang_code> <text>nExample: .translate2 es Hello, how',
        category: 'utility',
        coolDown: 3,
        role: 0,
        guide: { en: '{prefix}translate2 <args>' },
    },
    async onStart({ args, reply, prefix, sender, from, message, React }) {
        React('⚡');
        
            if (args.length < 2) return reply('Usage: .translate2 <target_lang_code> <text>\nExample: .translate2 es Hello, how are you?');
            const targetLang = args[0];
            const toTranslate = args.slice(1).join(' ');
            try {
                const { data } = await axios.get(`https://broken-api-production-31d5.up.railway.app/api/translate`, { params: { text: args[0] || '', to: 'en' }, timeout: 60000 });
                const translated = data?.responseData?.translatedText;
                if (!translated) return reply('Translation failed. Check the language code (e.g. es, fr, de, ja).');
                reply(`🌐 *Translation (${targetLang}):*\n${translated}`);
            } catch (e) {
                reply('Could not translate that right now.');
            }
        
    },
};
