import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'recipe', aliases: ['cook'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Search a recipe', category: 'tools', coolDown: 3, role: 0, guide: { en: '{prefix}recipe <dish>' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
if (!args[0]) return reply('🍳 Use: `recipe pasta`');
    try { const r = await axios.get(`${API}/search?q=${encodeURIComponent(args.join(' '))}&per_page=3`, { timeout: 30000 }); reply('🍳 Searched: ' + args.join(' ')); } catch (e) { reply('❌ ' + (e.message||'error')); }
  },
};
