import axios from 'axios';

const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
const chatStates = new Map(); // jid -> { enabled, history }

function getState(jid) {
  if (!chatStates.has(jid)) chatStates.set(jid, { enabled: false, history: [] });
  return chatStates.get(jid);
}

// Use the BROKEN API for chatbot replies
async function chatReply(prompt, history = []) {
  try {
    const res = await axios.get(`${API}/ai/chat`, {
      params: { q: prompt, provider: 'agnes' },
      timeout: 60000,
    });
    const data = res.data;
    if (data?.ok && data?.answer) return data.answer;
    throw new Error(data?.error || 'no answer');
  } catch (e) {
    try {
      const res = await axios.get(`${API}/ai/chat`, { params: { q: prompt, provider: 'gpt' }, timeout: 60000 });
      if (res.data?.ok && res.data?.answer) return res.data.answer;
    } catch {}
    return '😅 I could not respond right now. Try again later.';
  }
}

export default {
  config: {
    name: 'chatbot',
    aliases: ['chat', 'ai'],
    author: 'Broken_vzn',
    version: '2.0',
    shortDescription: 'AI chatbot (via BROKEN API)',
    category: 'ai',
    coolDown: 3,
    role: 0,
    guide: { en: '{prefix}chatbot on/off — toggle auto-reply\n{prefix}chatbot <text> — chat once' },
  },
  async onStart({ args, reply, from }) {
    const sub = (args[0] || '').toLowerCase();
    const state = getState(from);
    if (sub === 'on' || sub === 'enable') { state.enabled = true; return reply('✅ Chatbot enabled. I\'ll reply in this chat.'); }
    if (sub === 'off' || sub === 'disable') { state.enabled = false; return reply('✅ Chatbot disabled.'); }
    const q = args.join(' ');
    if (!q) return reply('Usage: `chatbot on/off` or `chatbot <message>`');
    const answer = await chatReply(q, state.history);
    state.history.push({ role: 'user', content: q }, { role: 'assistant', content: answer });
    if (state.history.length > 20) state.history = state.history.slice(-20);
    reply('🤖 ' + answer);
  },
};
