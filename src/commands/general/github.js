import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'github', aliases: ['gh'], author: 'Broken_vzn', version: '1.0', shortDescription: 'GitHub profile', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}github <username>' } },
  async onStart({ args, reply, sendImage }) {
if (!args[0]) return reply('🐙 Use: `github Neaterry6`');
    try { const r = await axios.get(`${API}/ported/github`, { params: { username: args[0] }, timeout: 30000 }); const p = r.data?.profile; if (!p) return reply('Not found.'); reply('🐙 *' + p.login + '* (' + (p.name||'') + ')\n📦 ' + p.publicRepos + ' repos · 👥 ' + p.followers + ' followers\n' + (p.bio||'')); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
