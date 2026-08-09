import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'trivia', aliases: ['quiz'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Random trivia question', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}trivia' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
try { const r = await axios.get(`${API}/quiz/trivia`, { params: { amount: 1 }, timeout: 30000 }); const q = r.data.questions?.[0]; if (!q) return reply('⚠️ No trivia.'); reply('❓ ' + q.question + '\n✅ ' + q.correctAnswer); } catch (e) { reply('❌ ' + e.message); }
  },
};
