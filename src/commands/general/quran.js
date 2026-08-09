import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'quran', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Read Quran (surah)', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}quran <surah number>' } },
  async onStart({ args, reply, sendImage }) {
const surah = Number(args[0]) || 1;
    try { const r = await axios.get(`${API}/ported/quran`, { params: { surah }, timeout: 30000 }); const d = r.data?.result; if (!d) return reply('⚠️ Not found.'); reply('📖 *' + d.englishName + ' (' + d.name + ')* — ' + d.numberOfAyahs + ' ayahs'); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
