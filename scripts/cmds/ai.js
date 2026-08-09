import axios from 'axios';

const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
const histories = new Map();

function getHistory(jid) {
  if (!histories.has(jid)) histories.set(jid, []);
  return histories.get(jid);
}
function trimHistory(jid, max = 10) {
  const h = getHistory(jid);
  if (h.length > max * 2) histories.set(jid, h.slice(-max * 2));
}

// Use the BROKEN API (Agnes 2.5) for AI chat
async function chatWithAI(prompt, history = []) {
  try {
    const res = await axios.get(`${API}/ai/chat`, {
      params: { q: prompt, provider: 'agnes' },
      timeout: 60000,
    });
    const data = res.data;
    if (data?.ok && data?.answer) return data.answer;
    throw new Error(data?.error || 'no answer');
  } catch (e) {
    // fallback provider
    try {
      const res = await axios.get(`${API}/ai/chat`, { params: { q: prompt, provider: 'gpt' }, timeout: 60000 });
      if (res.data?.ok && res.data?.answer) return res.data.answer;
    } catch {}
    return '⚠️ AI unavailable right now. Try again in a moment.';
  }
}

export default {
  config: {
    name: 'ai',
    aliases: ['gpt', 'chat', 'ask'],
    author: 'Broken_vzn',
    version: '2.0',
    shortDescription: 'Chat with AI (via BROKEN API)',
    category: 'ai',
    coolDown: 5,
    role: 0,
    guide: { en: '{prefix}ai <question>' },
  },
  async onStart({ args, reply, from }) {
    const q = args.join(' ');
    if (!q) return reply('🤖 Ask me anything: `ai <question>`');
    const thinking = await reply('🤖 Thinking...');
    const h = getHistory(from);
    const answer = await chatWithAI(q, h);
    h.push({ role: 'user', content: q }, { role: 'assistant', content: answer });
    trimHistory(from);
    reply('🤖 ' + answer);
    if (thinking?.key) { try { await reply(''); } catch {} }
  },
};
