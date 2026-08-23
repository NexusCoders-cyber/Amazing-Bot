import axios from 'axios';

const histories = new Map();

function getHistory(jid) {
    if (!histories.has(jid)) histories.set(jid, []);
    return histories.get(jid);
}

function trimHistory(jid, max = 10) {
    const h = getHistory(jid);
    if (h.length > max * 2) histories.set(jid, h.slice(-max * 2));
}

async function chatWithAI(prompt, history = []) {
    const messages = [
        { role: 'system', content: 'You are AmazingBot, a helpful WhatsApp assistant created by Raphael Ilom. Be concise but thorough.' },
        ...history,
        { role: 'user', content: prompt },
    ];
    const res = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model: 'gpt-3.5-turbo', messages, max_tokens: 500, temperature: 0.7 },
        { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' }, timeout: 30000 }
    );
    return res.data?.choices?.[0]?.message?.content || 'I could not generate a response.';
}

async function chatFreeAPI(prompt) {
    const res = await axios.post(
        'https://api.deepinfra.com/v1/openai/chat/completions',
        {
            model: 'meta-llama/Meta-Llama-3-8B-Instruct',
            messages: [
                { role: 'system', content: 'You are AmazingBot, a helpful WhatsApp assistant created by Raphael Ilom. Be concise.' },
                { role: 'user', content: prompt },
            ],
            max_tokens: 400,
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 20000 }
    );
    return res.data?.choices?.[0]?.message?.content || 'No response.';
}

export default {
    config: {
        name: 'ai',
        aliases: ['gpt', 'chat', 'ask'],
        author: 'Raphael Ilom',
        version: '1.0',
        shortDescription: 'Chat with AI',
        category: 'ai',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}ai <question> | {prefix}ai clear' },
    },

    async onStart({ sock, message, args, from, reply }) {
        if (!args.length) return reply('Ask a question: ai <your question>');

        if (args[0]?.toLowerCase() === 'clear') {
            histories.delete(from);
            return reply('Conversation history cleared.');
        }

        const prompt = args.join(' ');

        try {
            let response;
            const history = getHistory(from);

            if (process.env.OPENAI_API_KEY) {
                response = await chatWithAI(prompt, history);
                history.push({ role: 'user', content: prompt });
                history.push({ role: 'assistant', content: response });
                trimHistory(from);
            } else {
                response = await chatFreeAPI(prompt);
            }

            await sock.sendMessage(from, { text: response }, { quoted: message });
        } catch {
            reply('AI is unavailable right now. Try again later.');
        }
    },
};
