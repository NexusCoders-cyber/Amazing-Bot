import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'blstandings', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Bundesliga standings', category: 'sports', coolDown: 3, role: 0, guide: { en: '{prefix}blstandings' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
try { const r = await axios.get(`${API}/sports/standings`, { params: { league: 'bl' }, timeout: 30000 }); const t = r.data?.standings || r.data?.data || []; if (!t.length) return reply('No standings.'); reply('🏆 *Bundesliga Standings*\n' + t.slice(0,8).map((x,i) => (i+1) + '. ' + (x.team||x.name||'')).join('\n')); } catch (e) { reply('❌ ' + e.message); }
  },
};
