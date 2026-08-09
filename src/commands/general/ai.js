import axios from 'axios';

const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: {
    name: 'ai',
    aliases: ['gpt', 'chatgpt', 'ask'],
    author: 'Broken_vzn',
    version: '1.0',
    shortDescription: 'Ask the AI anything (GPT / Gemini / Claude / DeepSeek)',
    category: 'ai',
    coolDown: 5,
    role: 0,
    guide: { en: '{prefix}ai <question> — ask AI\n{prefix}ai gpt <question>\n{prefix}ai gemini <question>\n{prefix}ai claude <question>\n{prefix}ai deepseek <question>' },
  },
  async onStart({ message, args, reply, sender }) {
    if (!args[0]) return reply('❓ Ask me anything:\n\n`' + `ai <question>` + '`  — default AI\n`ai gpt <q>`  — GPT\n`ai gemini <q>`  — Gemini\n`ai claude <q>`  — Claude\n`ai deepseek <q>`  — DeepSeek');
    const providers = ['gpt', 'gemini', 'claude', 'deepseek', 'groq', 'agnes'];
    let provider = 'pollinations';
    let q = args.join(' ');
    if (providers.includes(args[0].toLowerCase())) { provider = args.shift().toLowerCase(); q = args.join(' '); }
    if (!q) return reply('❓ Give me a question to answer.');
    const thinking = await reply('🤖 Thinking...');
    try {
      const r = await axios.get(`${API}/ai/chat`, { params: { q, provider }, timeout: 60000 });
      const data = r.data;
      if (!data.ok || !data.answer) return reply('⚠️ ' + (data.error || 'AI could not answer right now.'));
      const answer = String(data.answer);
      const chunks = answer.match(/[\s\S]{1,3800}/g) || [answer];
      for (const c of chunks) await reply(`🤖 *${data.provider || provider}*\n\n${c}`);
      if (thinking?.key) { try { await message.chat?.deleteMessages?.([thinking.key]); } catch {} }
    } catch (e) {
      reply('❌ AI error: ' + (e.message || 'network error'));
    }
  },
};
