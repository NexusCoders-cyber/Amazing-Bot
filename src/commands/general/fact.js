import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'fact', aliases: ['facts'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Random fact', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}fact' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
try { const r = await axios.get(`${API}/facts/random`, { timeout: 20000 }); reply('💡 ' + r.data.fact); } catch (e) { reply('❌ ' + e.message); }
  },
};
