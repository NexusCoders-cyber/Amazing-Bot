import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'joke', aliases: ['jokes', 'meme'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Random joke', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}joke' } },
  async onStart({ args, reply }) {
    try {
      const r = await axios.get(`${API}/jokes/random`, { timeout: 20000 });
      const d = r.data;
      const j = Array.isArray(d?.jokes) ? d.jokes[0] : d?.joke;
      if (!j) return reply('😂 No joke right now.');
      reply('😂 *Joke*\n\n' + (typeof j === 'string' ? j : (j.joke || j.question + '\n' + j.answer)));
    } catch (e) { reply('❌ Joke error: ' + (e.message || 'network error')); }
  },
};
