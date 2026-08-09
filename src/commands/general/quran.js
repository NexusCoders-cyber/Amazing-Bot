import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'quran', aliases: [], author: 'Broken_vzn', version: '1.0', shortDescription: 'Quran (coming soon)', category: 'religion', coolDown: 3, role: 0, guide: { en: '{prefix}quran' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
reply('📖 Quran API coming soon.');
  },
};
