import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'weather', aliases: ['wth'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Weather for a city', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}weather <city>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
if (!args[0]) return reply('🌤️ `weather london`');
    try { const r = await axios.get(`${API}/tools/weather`, { params: { city: args.join(' ') }, timeout: 30000 }); reply('🌤️ ' + (r.data.location || args[0]) + ' - ' + (r.data.tempC ?? '?') + '°C'); } catch (e) { reply('❌ ' + e.message); }
  },
};
