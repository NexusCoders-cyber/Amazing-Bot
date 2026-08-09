import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'mediafire', aliases: ['mf'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Get MediaFire direct link', category: 'downloader', coolDown: 5, role: 0, guide: { en: '{prefix}mediafire <url>' } },
  async onStart({ args, reply }) {
    const url = args.find(a => /^https?:\/\//i.test(a));
    if (!url) return reply('🔗 Use: `mediafire <url>`');
    try {
      const r = await axios.get(`${API}/download/mediafire`, { params: { url }, timeout: 60000 });
      if (!r.data?.directUrl) return reply('⚠️ Could not extract a direct link for that file.');
      return reply('📦 *MediaFire*\n📄 ' + (r.data.fileName || 'file') + '\n🔗 ' + r.data.directUrl);
    } catch (e) { reply('❌ ' + (e.message || 'error')); }
  },
};
