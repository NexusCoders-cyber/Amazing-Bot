import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'pixabay', aliases: ['px'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Search Pixabay images', category: 'downloader', coolDown: 3, role: 0, guide: { en: '{prefix}pixabay <query>' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
if (!args[0]) return reply('🖼️ Use: `pixabay nature`');
    try { const r = await axios.get(`${API}/images/search`, { params: { q: args.join(' '), count: 5 }, timeout: 30000 }); const imgs = r.data?.images || []; if (!imgs.length) return reply('No results.'); if (sendImage) imgs.slice(0,3).forEach(i => sendImage(i.url)); else reply(imgs[0]?.url); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
