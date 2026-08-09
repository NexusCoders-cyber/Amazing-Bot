import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'wcmatches', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'World Cup matches', category: 'sports', coolDown: 3, role: 0, guide: { en: '{prefix}wcmatches' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
try { const r = await axios.get(`${API}/sports/leagues`, { params: { league: 'wc' }, timeout: 30000 }); const ms = r.data?.matches || r.data?.data || []; if (!ms.length) return reply('No matches.'); reply('⚽ *World Cup*\n' + ms.slice(0,5).map(m => '• ' + (m.homeTeam||'') + ' vs ' + (m.awayTeam||'')).join('\n')); } catch (e) { reply('❌ ' + e.message); }
  },
};
