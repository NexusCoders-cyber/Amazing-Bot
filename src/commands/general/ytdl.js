import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'ytdl', aliases: ['yt', 'youtube'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Download YouTube video', category: 'downloader', coolDown: 3, role: 0, guide: { en: '{prefix}ytdl <yt-url>' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
const url = args.find(a => /^https?:\/\//i.test(a)); if (!url) return reply('▶️ Use: `ytdl <yt-url>`');
    try { const r = await axios.get(`${API}/dl/video`, { params: { url }, timeout: 90000 }); const v = r.data; if (sendVideo && v.streamUrl) sendVideo(v.streamUrl, { caption: '⬇️ ' + (v.title||'video') }); else reply('▶️ ' + (v.streamUrl||'')); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
