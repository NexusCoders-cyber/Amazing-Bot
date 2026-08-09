import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'translate', aliases: ['tr'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Translate text', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}translate <text> | <to>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
if (!args[0]) return reply('🌍 `translate hello | fr`');
    const txt = args.join(' ').split('|')[0].trim(); const to = (args.join(' ').split('|')[1]||'en').trim();
    try { const r = await axios.get(`${API}/translate`, { params: { text: txt, to }, timeout: 30000 }); reply('🌍 ' + (r.data.translation || r.data.text || 'done')); } catch (e) { reply('❌ ' + e.message); }
  },
};
