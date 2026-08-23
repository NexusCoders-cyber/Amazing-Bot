import axios from 'axios';

const API_URL = 'https://api.eaglegnick.tech/api/v1/agnes/chat';

function extractReply(data) {
    if (typeof data === 'string') return data;
    if (!data || typeof data !== 'object') return null;
    return (
        data.result ??
        data.response ??
        data.answer ??
        data.message ??
        data.reply ??
        data.text ??
        data.data?.result ??
        data.data?.response ??
        data.data?.answer ??
        data.data?.message ??
        null
    );
}

async function askAgnes(prompt) {
    const res = await axios.get(API_URL, {
        params: { q: prompt },
        timeout: 30000,
    });
    const reply = extractReply(res.data);
    if (!reply) throw new Error('Unexpected API response format');
    return reply;
}

export default {
    config: {
        name: 'agnes',
        aliases: ['agnesai', 'eagle'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Chat with the Agnes AI API',
        category: 'ai',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}agnes <question>' },
    },

    async onStart({ sock, message, args, from, prefix, reply }) {
        if (!args.length) return reply(`Ask something: ${prefix}agnes <your question>`);

        const prompt = args.join(' ');

        try {
            await sock.sendPresenceUpdate('composing', from);
            const answer = await askAgnes(prompt);
            await sock.sendMessage(from, { text: answer }, { quoted: message });
        } catch (err) {
            reply(`❌ Agnes AI is unavailable right now.\n⚠️ ${err.message}`);
        }
    },
};
