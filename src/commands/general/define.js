import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'define', aliases: ['dictionary', 'meaning'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Dictionary — word meanings', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}define <word>' } },
  async onStart({ args, reply }) {
    if (!args[0]) return reply('📖 Usage: `define <word>`');
    const word = args[0];
    try {
      const r = await axios.get(`${API}/dictionary`, { params: { word }, timeout: 30000 });
      const d = r.data;
      if (!d.ok) return reply('⚠️ Word not found or dictionary unavailable.');
      let msg = `📖 *${d.word}*\n🔊 ${d.phonetic || ''}\n`;
      (d.meanings || []).slice(0, 3).forEach((m) => {
        msg += `\n_(${m.partOfSpeech})_\n`;
        (m.definitions || []).slice(0, 2).forEach((def) => { msg += `• ${def}\n`; });
      });
      reply(msg);
    } catch (e) { reply('❌ Dictionary error: ' + (e.message || 'network error')); }
  },
};
