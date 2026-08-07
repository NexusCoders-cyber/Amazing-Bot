import axios from 'axios';

const histories = new Map();

function getHistory(jid) {
    if (!histories.has(jid)) histories.set(jid, []);
    return histories.get(jid);
}

async function askGemini(prompt, history = []) {
    const contents = [...history.map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
    })), { role: 'user', parts: [{ text: prompt }] }];

    const { data } = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        { contents, generationConfig: { maxOutputTokens: 1024, temperature: 0.7 } },
        { timeout: 30000 }
    );
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response.';
}

async function askOpenAI(prompt, history = []) {
    const messages = [
        { role: 'system', content: 'You are a helpful, concise assistant. Be direct and useful.' },
        ...history,
        { role: 'user', content: prompt },
    ];
    const { data } = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        { model: 'gpt-4o-mini', messages, max_tokens: 1024, temperature: 0.7 },
        { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, timeout: 30000 }
    );
    return data.choices?.[0]?.message?.content || 'No response.';
}

async function askFree(prompt) {
    const { data } = await axios.post(
        'https://api.deepinfra.com/v1/openai/chat/completions',
        {
            model: 'meta-llama/Meta-Llama-3-8B-Instruct',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 512,
        },
        { timeout: 20000 }
    );
    return data.choices?.[0]?.message?.content || 'No response.';
}

export default {
    config: {
        name: 'copilot',
        aliases: ['gpt4', 'gemini', 'llm'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'AI copilot — Gemini, OpenAI, or free fallback',
        category: 'ai',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}copilot <question> | {prefix}copilot clear' },
    },
    async onStart({ args, from, reply, sock, message }) {
        if (!args.length) return reply('Ask me anything!\nUsage: copilot <question>');

        if (args[0]?.toLowerCase() === 'clear') {
            histories.delete(from);
            return reply('Memory cleared 🧹');
        }

        const prompt = args.join(' ');
        const history = getHistory(from);

        try {
            let response;
            if (process.env.GEMINI_API_KEY) {
                response = await askGemini(prompt, history);
            } else if (process.env.OPENAI_API_KEY) {
                response = await askOpenAI(prompt, history);
            } else {
                response = await askFree(prompt);
            }

            history.push({ role: 'user', content: prompt });
            history.push({ role: 'assistant', content: response });
            if (history.length > 20) history.splice(0, history.length - 20);

            await sock.sendMessage(from, { text: response }, { quoted: message });
        } catch (err) {
            reply('AI is unavailable. Try again later.');
        }
    },
};
