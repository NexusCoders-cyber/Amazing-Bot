import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'checker', aliases: ['username'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Check username availability', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}checker <username>' } },
  async onStart({ args, reply, sendImage }) {
if (!args[0]) return reply('🔍 Use: `checker myname`');
    try { const r = await axios.get(`${API}/ported/checker`, { params: { username: args[0] }, timeout: 30000 }); const res = r.data?.results||{}; reply('🔍 *' + args[0] + '*\n' + Object.entries(res).map(([k,v]) => '• ' + k + ': ' + (v==='taken'?'❌ taken':'✅ available')).join('\n')); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
