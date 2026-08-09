import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'wallpaper', aliases: ['wp'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Get a wallpaper', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}wallpaper <query>' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
const q = args.join(' ')||'nature';
    try { const r = await axios.get(`${API}/images/search`, { params: { q, count: 5 }, timeout: 30000 }); const imgs = r.data?.images||[]; if (imgs[0]?.url && sendImage) sendImage(imgs[0].url); else reply(imgs[0]?.url||'none'); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
