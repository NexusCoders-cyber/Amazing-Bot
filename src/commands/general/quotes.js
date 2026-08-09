import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'quotes', aliases: ['quote'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Random quote', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}quotes' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
try { const r = await axios.get(`${API}/tools/quote`, { timeout: 20000 }); reply('💬 "' + r.data.quote + '"\n— ' + (r.data.author || '')); } catch (e) { reply('❌ ' + e.message); }
  },
};
