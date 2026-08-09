import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'imdb', aliases: ['movieinfo'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Search IMDb movie info', category: 'search', coolDown: 3, role: 0, guide: { en: '{prefix}imdb <movie>' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
if (!args[0]) return reply('🎬 Use: `imdb inception`');
    try { const r = await axios.get(`${API}/search?q=${encodeURIComponent(args.join(' '))}&type=movie&per_page=3`, { timeout: 30000 }); const ms = r.data?.results||[]; if (!ms.length) return reply('No results.'); reply('🎬 *' + ms[0].title + '*\n📅 ' + (ms[0].year||'') + '\n⭐ ' + (ms[0].rating||'') + '\n' + (ms[0].description||'').slice(0,200)); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
