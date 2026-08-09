import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'translate2', aliases: ['tr2'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Translate text (alt)', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}translate2 <text>|<to>' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
if (!args[0]) return reply('🌍 Use: `translate2 hello|fr`');
    const parts = args.join(' ').split('|'); const txt = parts[0].trim(); const to = (parts[1]||'en').trim();
    try { const r = await axios.get(`${API}/translate`, { params: { text: txt, to }, timeout: 30000 }); reply('🌍 ' + (r.data?.translation || r.data?.text || 'done')); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
