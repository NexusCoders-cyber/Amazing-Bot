import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'browse', aliases: ['web'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Fetch a webpage as text', category: 'tools', coolDown: 3, role: 0, guide: { en: '{prefix}browse <url>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
const url = args.find(a => /^https?:\/\//i.test(a)); if (!url) return reply('🌐 `browse <url>`');
    try { const r = await axios.get(url, { timeout: 30000 }); reply('🌐 ' + String(r.data).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0, 1500)); } catch (e) { reply('❌ ' + e.message); }
  },
};
