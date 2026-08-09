import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'twitter', aliases: ['x'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Download Twitter/X video', category: 'downloader', coolDown: 3, role: 0, guide: { en: '{prefix}twitter <url>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
const url = args.find(a => /^https?:\/\//i.test(a)); if (!url) return reply('🔗 `twitter <url>`');
    try { const r = await axios.get(`${API}/social/video`, { params: { url }, timeout: 90000 }); if (!r.data?.streamUrl) return reply('⚠️ Could not download.'); if (sendVideo) sendVideo(r.data.streamUrl, { caption: '⬇️ Twitter' }); else reply('🔗 ' + r.data.streamUrl); } catch (e) { reply('❌ ' + e.message); }
  },
};
