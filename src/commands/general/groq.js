import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'groq', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Chat with Groq', category: 'ai', coolDown: 3, role: 0, guide: { en: '{prefix}groq <question>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
if (!args[0]) return reply('⚡ Ask: `groq <question>`');
    try { const r = await axios.get(`${API}/ai/chat`, { params: { q: args.join(' '), provider: 'groq' }, timeout: 60000 }); reply('⚡ Groq: ' + (r.data?.answer || 'no reply')); } catch (e) { reply('❌ ' + e.message); }
  },
};
