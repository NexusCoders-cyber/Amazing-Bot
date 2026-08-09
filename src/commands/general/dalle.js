import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'dalle', aliases: ['imagine'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Generate AI image', category: 'ai', coolDown: 3, role: 0, guide: { en: '{prefix}dalle <prompt>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
if (!args[0]) return reply('🎨 Describe: `dalle a red dragon`');
    try { const r = await axios.get(`${API}/ai/image`, { params: { prompt: args.join(' ') }, timeout: 90000 }); if (!r.data?.imageUrl) return reply('⚠️ Could not generate.'); if (sendImage) sendImage(r.data.imageUrl, { caption: '🎨 ' + args.join(' ') }); else reply('🖼️ ' + r.data.imageUrl); } catch (e) { reply('❌ ' + e.message); }
  },
};
