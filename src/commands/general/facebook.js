import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'facebook', aliases: ['fb'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Download Facebook video', category: 'downloader', coolDown: 3, role: 0, guide: { en: '{prefix}facebook <url>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
const url = args.find(a => /^https?:\/\//i.test(a)); if (!url) return reply('🔗 `facebook <url>`');
    try { const r = await axios.get(`${API}/social/video`, { params: { url }, timeout: 90000 }); if (!r.data?.streamUrl) return reply('⚠️ Could not download.'); if (sendVideo) sendVideo(r.data.streamUrl, { caption: '⬇️ Facebook' }); else reply('🔗 ' + r.data.streamUrl); } catch (e) { reply('❌ ' + e.message); }
  },
};
