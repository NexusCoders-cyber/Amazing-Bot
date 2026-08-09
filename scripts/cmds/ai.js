import axios from 'axios';

const API = process.env.BROKEN_API || 'https://api.brokenvzn.de5.net/api';
const histories = new Map();

function getHistory(jid) {
  if (!histories.has(jid)) histories.set(jid, []);
  return histories.get(jid);
}
function trimHistory(jid, max = 10) {
  const h = getHistory(jid);
  if (h.length > max * 2) histories.set(jid, h.slice(-max * 2));
}

// Use the BROKEN API (Agnes 2.5) for AI chat — send only the reply, no status messages.
async function chatWithAI(prompt, provider = 'agnes') {
  try {
    const res = await axios.get(`${API}/ai/chat`, { params: { q: prompt, provider }, timeout: 60000 });
    const data = res.data;
    if (data?.ok && data?.answer) return String(data.answer);
    throw new Error(data?.error || 'no answer');
  } catch (e) {
    try {
      const res = await axios.get(`${API}/ai/chat`, { params: { q: prompt, provider: 'gpt' }, timeout: 60000 });
      if (res.data?.ok && res.data?.answer) return String(res.data.answer);
    } catch {}
    throw new Error('AI unavailable right now. Try again in a moment.');
  }
}

export default {
  config: {
    name: 'ai',
    aliases: ['gpt', 'chat', 'ask', 'gemini', 'claude', 'deepseek'],
    author: 'Broken_vzn',
    version: '3.0',
    shortDescription: 'Chat with AI (via BROKEN API)',
    category: 'ai',
    coolDown: 5,
    role: 0,
    guide: { en: '{prefix}ai <question>\n{prefix}ai <provider> <question> — gpt/gemini/claude/deepseek/groq/agnes\nReply to a message with `ai` to ask about it' },
  },
  async onStart({ args, reply, from }) {
    const providers = ['gpt', 'gemini', 'claude', 'deepseek', 'groq', 'agnes'];
    let provider = 'agnes';
    let q = args.join(' ');
    if (providers.includes((args[0] || '').toLowerCase())) { provider = args.shift().toLowerCase(); q = args.join(' '); }
    if (!q) return reply('🤖 Ask me anything: `ai <question>`\nOr reply to a message with `ai` to ask about it.');
    const h = getHistory(from);
    try {
      const answer = await chatWithAI(q, provider);
      h.push({ role: 'user', content: q }, { role: 'assistant', content: answer });
      trimHistory(from);
      // send ONLY the reply (no "Thinking..." message)
      reply('🤖 ' + answer);
    } catch (e) {
      reply('⚠️ ' + e.message);
    }
  },
  // Reply to a quoted message with `ai` — ask the AI about that message
  async onReply({ message, reply, from }) {
    const quoted = message?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) return false;
    const quotedText = quoted.conversation || quoted.extendedTextMessage?.text || '';
    if (!quotedText) return false;
    const q = 'Explain or respond to this: ' + quotedText;
    try {
      const answer = await chatWithAI(q, 'agnes');
      reply('🤖 ' + answer);
      return true;
    } catch (e) {
      reply('⚠️ ' + e.message);
      return true;
    }
  },
};
