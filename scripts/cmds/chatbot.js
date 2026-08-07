import axios from 'axios';

const chatStates = new Map(); // jid -> { enabled, history }

function getState(jid) {
    if (!chatStates.has(jid)) chatStates.set(jid, { enabled: false, history: [] });
    return chatStates.get(jid);
}

async function chatReply(prompt, history = []) {
    const messages = [
        { role: 'system', content: 'You are a friendly WhatsApp group chatbot. Be concise, fun, and helpful. Max 2-3 sentences.' },
        ...history.slice(-10),
        { role: 'user', content: prompt },
    ];

    // Try Gemini free tier, then OpenAI, then DeepInfra
    if (process.env.GEMINI_API_KEY) {
        const { data } = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            { contents: messages.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })) },
            { timeout: 15000 }
        );
        return data.candidates?.[0]?.content?.parts?.[0]?.text;
    }
    if (process.env.OPENAI_API_KEY) {
        const { data } = await axios.post('https://api.openai.com/v1/chat/completions',
            { model: 'gpt-4o-mini', messages, max_tokens: 200 },
            { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, timeout: 15000 }
        );
        return data.choices?.[0]?.message?.content;
    }
    const { data } = await axios.post('https://api.deepinfra.com/v1/openai/chat/completions',
        { model: 'meta-llama/Meta-Llama-3-8B-Instruct', messages, max_tokens: 200 },
        { timeout: 15000 }
    );
    return data.choices?.[0]?.message?.content;
}

export default {
    config: {
        name: 'chatbot',
        aliases: ['autobot', 'botmode'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Toggle auto-reply chatbot mode (group only)',
        category: 'ai',
        coolDown: 5,
        role: 0,
        guide: { en: '{prefix}chatbot on|off' },
    },

    // onChat handler: auto-reply to messages when enabled
    onChat: async ({ message, from, sender, args: _args, reply: _reply, sock }) => {
        try {
            const state = getState(from);
            if (!state.enabled) return;
            // Don't reply to bot messages
            const botId = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
            if (sender === botId) return;

            const text = message.message?.conversation || message.message?.extendedTextMessage?.text;
            if (!text || text.startsWith('!') || text.startsWith('.')) return;

            const response = await chatReply(text, state.history);
            if (!response) return;

            state.history.push({ role: 'user', content: text });
            state.history.push({ role: 'assistant', content: response });
            if (state.history.length > 20) state.history.splice(0, state.history.length - 20);

            await sock.sendMessage(from, { text: response }, { quoted: message });
        } catch {}
    },

    // Command to toggle
    async onStart({ args, from, isGroup, isGroupAdmin, reply }) {
        if (!isGroup) return reply('Group-only command.');
        if (!isGroupAdmin) return reply('Admin-only.');

        const sub = (args[0] || '').toLowerCase();
        if (!['on', 'off', 'status'].includes(sub)) {
            return reply('Usage: chatbot on|off|status');
        }

        const state = getState(from);
        if (sub === 'on') {
            state.enabled = true;
            return reply('🤖 Chatbot mode enabled! I\'ll auto-reply to messages.');
        }
        if (sub === 'off') {
            state.enabled = false;
            state.history = [];
            return reply('🤖 Chatbot mode disabled.');
        }
        reply(`Chatbot: ${state.enabled ? 'ON ✅' : 'OFF ❌'}`);
    },
};
