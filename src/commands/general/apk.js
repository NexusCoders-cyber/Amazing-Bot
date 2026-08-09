import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: { name: 'apk', aliases: ['apkdl'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Download APK by package/name', category: 'downloader', coolDown: 5, role: 0, guide: { en: '{prefix}apk <app name or package>' } },
  async onStart({ args, reply }) {
    if (!args[0]) return reply('📦 Use: `apk telegram` or `apk org.telegram.messenger`');
    try {
      let pkg = args[0];
      if (!pkg.includes('.')) {
        const s = await axios.get(`${API}/apk/search`, { params: { q: pkg }, timeout: 30000 });
        pkg = s.data?.packageName || pkg;
      }
      const r = await axios.get(`${API}/apk`, { params: { package: pkg }, timeout: 60000 });
      const size = r.data?.size ? ((r.data.size / 1048576).toFixed(1) + 'MB') : '';
      return reply('📦 *APK*\n📄 ' + (r.data?.fileName || pkg) + ' ' + size + '\n🔗 ' + r.data?.downloadUrl);
    } catch (e) { reply('❌ ' + (e.message || 'error')); }
  },
};
