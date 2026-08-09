import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'define', aliases: ['dictionary', 'meaning'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Word meaning', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}define <word>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
if (!args[0]) return reply('📖 `define code`');
    try { const r = await axios.get(`${API}/dictionary`, { params: { word: args[0] }, timeout: 30000 }); const m = r.data; let s = '📖 *' + m.word + '*'; (m.meanings||[]).slice(0,2).forEach(x => { s += '\n_(' + x.partOfSpeech + ')_'; (x.definitions||[]).slice(0,2).forEach(d => s += '\n• ' + d); }); reply(s); } catch (e) { reply('❌ Word not found.'); }
  },
};
