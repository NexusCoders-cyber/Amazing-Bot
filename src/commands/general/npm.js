import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'npm', aliases: ['npmpkg'], author: 'Broken_vzn', version: '1.0', shortDescription: 'npm package info', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}npm <package>' } },
  async onStart({ args, reply, sendImage }) {
if (!args[0]) return reply('📦 Use: `npm express`');
    try { const r = await axios.get(`${API}/ported/npm`, { params: { q: args[0] }, timeout: 30000 }); const d = r.data; if (!d?.package) return reply('Not found.'); reply('📦 *' + d.package + '* v' + d.latest + '\n' + (d.description||'') + '\n👤 ' + (d.author||'') ); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
