import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'fact', aliases: ['randomfact', 'facts'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Random fun fact', category: 'fun', coolDown: 3, role: 0, guide: { en: '{prefix}fact' } },
  async onStart({ args, reply }) {
    const count = Number(args[0]) || 1;
    try {
      const out = [];
      for (let i = 0; i < Math.min(count, 5); i++) {
        const r = await axios.get(`${API}/facts/random`, { timeout: 20000 });
        if (r.data?.fact) out.push(r.data.fact);
      }
      if (!out.length) return reply('ℹ️ No fact right now.');
      reply('💡 *Random Fact*\n\n' + out.map((f) => '• ' + f).join('\n'));
    } catch (e) { reply('❌ Fact error: ' + (e.message || 'network error')); }
  },
};
