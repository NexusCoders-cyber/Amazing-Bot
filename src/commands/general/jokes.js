import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'jokes', aliases: ['joke', 'meme'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Random joke', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}jokes' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
try { const r = await axios.get(`${API}/jokes/random`, { timeout: 20000 }); const j = Array.isArray(r.data?.jokes) ? r.data.jokes[0] : r.data?.joke; reply('😂 ' + (typeof j === 'string' ? j : (j?.joke || j?.question || 'no joke'))); } catch (e) { reply('❌ ' + e.message); }
  },
};
