import axios from 'axios';

const API = process.env.BROKEN_API || 'https://api.brokenvzn.de5.net/api';

export default {
  config: {
    name: 'ai',
    aliases: ['gpt', 'chatgpt', 'ask'],
    author: 'Broken_vzn',
    version: '2.0',
    shortDescription: 'Ask the AI anything (GPT / Gemini / Claude / DeepSeek)',
    category: 'ai',
    coolDown: 5,
    role: 0,
    guide: { en: '{prefix}ai <question>\n{prefix}ai gpt <q> / gemini / claude / deepseek\nReply to a message with ai to ask about it' },
  },
  async onStart({ args, reply }) {
    const providers = ['gpt', 'gemini', 'claude', 'deepseek', 'groq', 'agnes'];
    let provider = 'agnes';
    let q = args.join(' ');
    if (providers.includes((args[0] || '').toLowerCase())) { provider = args.shift().toLowerCase(); q = args.join(' '); }
    if (!q) return reply('❓ Ask me anything:\n`ai <question>`\n`ai gpt/gemini/claude/deepseek <q>`\nOr reply to a message with `ai`.');
    try {
      const r = await axios.get(`${API}/ai/chat`, { params: { q, provider }, timeout: 60000 });
      const data = r.data;
      if (!data.ok || !data.answer) return reply('⚠️ ' + (data.error || 'AI could not answer right now.'));
      const answer = String(data.answer);
      const chunks = answer.match(/[\s\S]{1,3800}/g) || [answer];
      for (const c of chunks) reply('🤖 ' + c);
    } catch (e) {
      reply('⚠️ AI unavailable right now. Try again in a moment.');
    }
  },
  async onReply({ message, reply }) {
    const quoted = message?.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) return false;
    const quotedText = quoted.conversation || quoted.extendedTextMessage?.text || '';
    if (!quotedText) return false;
    try {
      const r = await axios.get(`${API}/ai/chat`, { params: { q: 'Explain or respond to this: ' + quotedText, provider: 'agnes' }, timeout: 60000 });
      if (r.data?.ok && r.data?.answer) reply('🤖 ' + String(r.data.answer));
      return true;
    } catch (e) { reply('⚠️ AI unavailable right now.'); return true; }
  },
};
