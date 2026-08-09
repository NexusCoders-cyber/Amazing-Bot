import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'qrcode', aliases: ['qr'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Generate QR code', category: 'utility', coolDown: 3, role: 0, guide: { en: '{prefix}qrcode <text>' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
if (!args[0]) return reply('🔳 `qrcode hello`');
    try { const r = await axios.get(`${API}/tools/qr`, { params: { data: args.join(' '), size: 400 }, timeout: 30000 }); if (sendImage) sendImage(r.data.qrUrl); else reply('🔗 ' + r.data.qrUrl); } catch (e) { reply('❌ ' + e.message); }
  },
};
