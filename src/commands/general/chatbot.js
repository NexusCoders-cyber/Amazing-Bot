import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'chatbot', aliases: ['chat', 'askai'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Chat with the AI', category: 'ai', coolDown: 3, role: 0, guide: { en: '{prefix}chatbot <question>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
if (!args[0]) return reply('💬 Ask me: `chatbot <question>`');
    try { const r = await axios.get(`${API}/ai/chat`, { params: { q: args.join(' '), provider: 'pollinations' }, timeout: 60000 }); if (!r.data?.ok || !r.data?.answer) return reply('⚠️ AI unavailable.'); reply('🤖 ' + r.data.answer); } catch (e) { reply('❌ ' + e.message); }
  },
};
