import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'weather', aliases: ['wth', 'forecast'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Weather for any city', category: 'utility', coolDown: 5, role: 0, guide: { en: '{prefix}weather <city>' } },
  async onStart({ args, reply }) {
    if (!args[0]) return reply('🌤️ Usage: `weather <city>`  e.g. `weather london`');
    const city = args.join(' ');
    try {
      const r = await axios.get(`${API}/tools/weather`, { params: { city }, timeout: 30000 });
      const d = r.data;
      if (!d.ok) return reply('⚠️ ' + (d.error || 'Weather unavailable.'));
      return reply(`🌤️ *${d.location || city}* (${d.country || ''})\n🌡️ ${d.tempC ?? '?'}°C / ${d.tempF ?? '?'}°F\n💧 ${d.humidity ?? '?'}% · 💨 ${d.wind ?? '?'}\n${d.condition ? '☁️ ' + d.condition : ''}`);
    } catch (e) { reply('❌ Weather error: ' + (e.message || 'network error')); }
  },
};
