import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'ssweb', aliases: ['screenshot', 'shot'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Website screenshot', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}ssweb <url>' } },
  async onStart({ args, reply, sendImage }) {
const url = args.find(a => /^https?:\/\//i.test(a)); if (!url) return reply('📸 Use: `ssweb https://example.com`');
    try { const r = await axios.get(`${API}/ported/screenshot`, { params: { url }, timeout: 30000 }); if (r.data?.imageUrl && sendImage) sendImage(r.data.imageUrl); else reply('📸 ' + (r.data?.imageUrl||'')); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
