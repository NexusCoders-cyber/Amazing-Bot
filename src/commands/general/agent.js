import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: {
    name: 'agent',
    aliases: ['codeagent', 'website', 'build'],
    author: 'Broken_vzn',
    version: '1.0',
    shortDescription: 'Generate a complete website or APK project',
    category: 'ai',
    coolDown: 5,
    role: 0,
    guide: { en: '{prefix}agent website <title> [theme] — generate a website\n{prefix}agent apk <title> <package> — generate an APK project\n{prefix}agent list — list agents' },
  },
  async onStart({ args, reply }) {
    const sub = (args[0] || '').toLowerCase();
    if (sub === 'list') {
      try {
        const r = await axios.get(`${API}/agent/list`, { timeout: 20000 });
        const agents = r.data?.agents || [];
        return reply('🤖 *Agents:*\n' + agents.map(a => `• ${a.id}: ${a.name || a.description || ''}`).join('\n'));
      } catch (e) { return reply('❌ ' + (e.message || 'error')); }
    }
    if (sub === 'website' || sub === 'apk') {
      if (!args[1]) return reply('Usage: `agent ' + sub + ' <title>`\nExample: `agent website TechHub`\nExample: `agent apk MyApp com.example.myapp`');
      const title = args[1];
      const theme = args[2] || 'dark';
      const pkg = sub === 'apk' ? (args[2] || 'com.example.' + title.toLowerCase().replace(/[^a-z0-9]/g, '')) : undefined;
      const thinking = await reply('🛠️ Generating ' + sub + ' "' + title + '"... this takes a moment.');
      try {
        const params = sub === 'website' ? { title, theme } : { title, packageName: pkg };
        const r = await axios.get(`${API}/agent/${sub}`, { params, timeout: 120000 });
        const d = r.data;
        if (!d.ok) return reply('⚠️ ' + (d.error || 'Generation failed.'));
        const base = API.replace(/\/api$/, '');
        const zipUrl = d.zipUrl ? base + d.zipUrl : (d.downloadUrl || d.url || '');
        reply(`✅ *${sub.toUpperCase()} generated!*\n🧩 Session: ${d.sessionId || ''}\n📦 Type: ${d.type || sub}\n🔗 Download: ${zipUrl}`);
        if (thinking?.key) { try { await reply('💡 Tip: send `agent download ' + d.sessionId + '` to get the zip.'); } catch {} }
      } catch (e) { reply('❌ ' + (e.message || 'error')); }
      return;
    }
    if (sub === 'download') {
      const sid = args[1];
      if (!sid) return reply('Usage: `agent download <sessionId>`');
      try {
        const base = API.replace(/\/api$/, '');
        reply('📦 Download: ' + base + '/api/agent/download?sessionId=' + encodeURIComponent(sid));
      } catch (e) { reply('❌ ' + (e.message || 'error')); }
      return;
    }
    return reply('🤖 *Coding Agent*\n\n`agent website <title> [theme]` — generate a website\n`agent apk <title> <package>` — generate an APK project\n`agent download <sessionId>` — get the zip\n`agent list` — list agents\n\nThemes: dark, light, neon, sunset, forest');
  },
};
