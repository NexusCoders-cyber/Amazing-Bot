import axios from 'axios';

const LANG_CODES = {
    english: 'en', yoruba: 'yo', igbo: 'ig', hausa: 'ha',
    french: 'fr', spanish: 'es', arabic: 'ar', german: 'de',
    portuguese: 'pt', swahili: 'sw', chinese: 'zh', japanese: 'ja',
    korean: 'ko', russian: 'ru', italian: 'it',
};

async function translate(text, target) {
    const res = await axios.get(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${target}`,
        { timeout: 10000 }
    );
    return res.data?.responseData?.translatedText || null;
}

export default {
    config: {
        name: 'translate',
        aliases: ['tr', 'trans'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Translate text to another language',
        category: 'utility',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}translate <language> <text>' },
    },
    async onStart({ message, args, reply }) {
        if (args.length < 2) return reply('Usage: translate <language> <text>\nExample: translate yoruba Hello');

        const langInput = args[0].toLowerCase();
        const text = args.slice(1).join(' ');
        const langCode = LANG_CODES[langInput] || langInput;

        const ctx = message?.message?.extendedTextMessage?.contextInfo;
        const sourceText = ctx
            ? (ctx.quotedMessage?.conversation || ctx.quotedMessage?.extendedTextMessage?.text || text)
            : text;

        try {
            const result = await translate(sourceText, langCode);
            if (!result) return reply('Translation failed. Try a different language.');
            reply(result);
        } catch {
            reply('Translation service unavailable. Try again later.');
        }
    },
};
