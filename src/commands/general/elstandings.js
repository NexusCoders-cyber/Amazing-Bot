import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'elstandings', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Europa League standings', category: 'sports', coolDown: 3, role: 0, guide: { en: '{prefix}elstandings' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
try { const r = await axios.get(`${API}/sports/standings`, { params: { league: 'el' }, timeout: 30000 }); const t = r.data?.standings || r.data?.data || []; if (!t.length) return reply('No standings.'); reply('🏆 *Europa League Standings*\n' + t.slice(0,8).map((x,i) => (i+1) + '. ' + (x.team||x.name||'')).join('\n')); } catch (e) { reply('❌ ' + e.message); }
  },
};
