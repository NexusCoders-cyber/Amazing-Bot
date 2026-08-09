import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'yts', aliases: ['youtube', 'ytsearch'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Search YouTube', category: 'search', coolDown: 3, role: 0, guide: { en: '{prefix}yts <query>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
if (!args[0]) return reply('🔍 `yts <query>`');
    try { const r = await axios.get(`${API}/yt/search`, { params: { q: args.join(' '), limit: 5 }, timeout: 30000 }); const vs = r.data?.results || r.data?.videos || []; if (!vs.length) return reply('No results.'); reply('🎥 *Results:*\n' + vs.slice(0,5).map((v,i) => (i+1) + '. ' + v.title).join('\n')); } catch (e) { reply('❌ ' + e.message); }
  },
};
