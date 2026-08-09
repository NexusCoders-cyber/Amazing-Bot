import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'ytmp3', aliases: ['tomp3', 'audio', 'songdl'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Get YouTube audio/mp3', category: 'downloader', coolDown: 3, role: 0, guide: { en: '{prefix}ytmp3 <yt-url>' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
const url = args.find(a => /^https?:\/\//i.test(a)); if (!url) return reply('🎵 Use: `ytmp3 <yt-url>`');
    try { const r = await axios.get(`${API}/dl/video`, { params: { url }, timeout: 90000 }); const v = r.data; reply('🎵 ' + (v.title||'audio') + '\n🔗 ' + (v.formats?.find(f=>!f.hasVideo)?.url || v.streamUrl || '')); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
