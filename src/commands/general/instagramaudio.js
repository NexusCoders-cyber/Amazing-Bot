import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'instagramaudio', aliases: ['igaudio'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Get Instagram reel audio', category: 'downloader', coolDown: 3, role: 0, guide: { en: '{prefix}igaudio <url>' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
const url = args.find(a => /^https?:\/\//i.test(a)); if (!url) return reply('🎵 Use: `igaudio <ig-url>`');
    try { const r = await axios.get(`${API}/social/video`, { params: { url }, timeout: 90000 }); reply('🎵 ' + (r.data?.title||'audio') + '\n🔗 ' + (r.data?.streamUrl||'')); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
