import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'spotify', aliases: ['song'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Search/download song (Spotify)', category: 'downloader', coolDown: 3, role: 0, guide: { en: '{prefix}spotify <song>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
if (!args[0]) return reply('🎵 `spotify <song name>`');
    try { const r = await axios.get(`${API}/yt/search`, { params: { q: args.join(' ') + ' audio', limit: 1 }, timeout: 30000 }); const v = r.data?.results?.[0] || r.data?.videos?.[0]; reply('🎵 ' + (v?.title || 'song') + '\n🔗 ' + (v?.url || v?.id)); } catch (e) { reply('❌ ' + e.message); }
  },
};
