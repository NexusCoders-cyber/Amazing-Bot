import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'memes', aliases: ['meme'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Get a meme', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}memes' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
try { const r = await axios.get(`${API}/tools/memes`, { timeout: 30000 }); const m = r.data?.memes?.[0]; if (m?.url && sendImage) sendImage(m.url, { caption: m.name||'meme' }); else reply('😂 Meme endpoint'); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
