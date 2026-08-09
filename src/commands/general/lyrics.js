import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'lyrics', aliases: ['songlyrics'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Get song lyrics', category: 'search', coolDown: 3, role: 0, guide: { en: '{prefix}lyrics <song>' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
if (!args[0]) return reply('🎤 Use: `lyrics <song name>`');
    try { const r = await axios.get(`${API}/tools/lyrics`, { params: { title: args.join(' ') }, timeout: 30000 }); reply('🎤 *' + (r.data?.title||'Lyrics') + '*\n' + String(r.data?.lyrics||'Not found').slice(0,1500)); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
