import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'genpass', aliases: ['password'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Generate a strong password', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}genpass <length>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
const len = Number(args[0]) || 16;
    try { const r = await axios.get(`${API}/tools/password`, { params: { length: len }, timeout: 20000 }); reply('🔐 Password: `' + (r.data.password || r.data) + '`'); } catch (e) { reply('❌ ' + e.message); }
  },
};
