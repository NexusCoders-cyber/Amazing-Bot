import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'shorten', aliases: ['tinyurl'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Shorten a URL', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}shorten <url>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
const url = args.find(a => /^https?:\/\//i.test(a)); if (!url) return reply('🔗 `shorten <url>`');
    try { const r = await axios.get(`${API}/tools/shorten`, { params: { url }, timeout: 30000 }); reply('🔗 ' + (r.data.shortUrl || r.data.url)); } catch (e) { reply('❌ ' + e.message); }
  },
};
