import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'imdb', aliases: ['movie'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Search IMDb', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}imdb <movie>' } },
  async onStart({ args, reply, sendImage }) {
if (!args[0]) return reply('🎬 Use: `imdb inception`');
    try { const r = await axios.get(`${API}/ported/imdb`, { params: { q: args.join(' ') }, timeout: 30000 }); const rs = r.data?.results||[]; if (!rs.length) return reply('No results.'); reply('🎬 *' + rs[0].title + '* (' + (rs[0].year||'') + ')\n' + (rs[0].cast||'')); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
