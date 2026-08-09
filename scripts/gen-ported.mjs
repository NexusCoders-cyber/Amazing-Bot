// Generator: ported endpoints as bot commands (via BROKEN API).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(__dirname, '..', 'src', 'commands', 'general');

const TMPL = (name, aliases, desc, guide, body) => `import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: '${name}', aliases: [${aliases.map(a => `'${a}'`).join(', ')}], author: 'Broken_vzn', version: '1.0', shortDescription: '${desc}', category: 'utility', coolDown: 3, role: 0, guide: { en: '${guide}' } },
  async onStart({ args, reply, sendImage }) {
${body}
  },
};
`;

const cmds = {
  'quran': { aliases: [], desc: 'Read Quran (surah)', guide: '{prefix}quran <surah number>', body: `const surah = Number(args[0]) || 1;\n    try { const r = await axios.get(\`\${API}/ported/quran\`, { params: { surah }, timeout: 30000 }); const d = r.data?.result; if (!d) return reply('⚠️ Not found.'); reply('📖 *' + d.englishName + ' (' + d.name + ')* — ' + d.numberOfAyahs + ' ayahs'); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'imdb': { aliases: ['movie'], desc: 'Search IMDb', guide: '{prefix}imdb <movie>', body: `if (!args[0]) return reply('🎬 Use: \`imdb inception\`');\n    try { const r = await axios.get(\`\${API}/ported/imdb\`, { params: { q: args.join(' ') }, timeout: 30000 }); const rs = r.data?.results||[]; if (!rs.length) return reply('No results.'); reply('🎬 *' + rs[0].title + '* (' + (rs[0].year||'') + ')\\n' + (rs[0].cast||'')); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'github': { aliases: ['gh'], desc: 'GitHub profile', guide: '{prefix}github <username>', body: `if (!args[0]) return reply('🐙 Use: \`github Neaterry6\`');\n    try { const r = await axios.get(\`\${API}/ported/github\`, { params: { username: args[0] }, timeout: 30000 }); const p = r.data?.profile; if (!p) return reply('Not found.'); reply('🐙 *' + p.login + '* (' + (p.name||'') + ')\\n📦 ' + p.publicRepos + ' repos · 👥 ' + p.followers + ' followers\\n' + (p.bio||'')); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'npm': { aliases: ['npmpkg'], desc: 'npm package info', guide: '{prefix}npm <package>', body: `if (!args[0]) return reply('📦 Use: \`npm express\`');\n    try { const r = await axios.get(\`\${API}/ported/npm\`, { params: { q: args[0] }, timeout: 30000 }); const d = r.data; if (!d?.package) return reply('Not found.'); reply('📦 *' + d.package + '* v' + d.latest + '\\n' + (d.description||'') + '\\n👤 ' + (d.author||'') ); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'checker': { aliases: ['username'], desc: 'Check username availability', guide: '{prefix}checker <username>', body: `if (!args[0]) return reply('🔍 Use: \`checker myname\`');\n    try { const r = await axios.get(\`\${API}/ported/checker\`, { params: { username: args[0] }, timeout: 30000 }); const res = r.data?.results||{}; reply('🔍 *' + args[0] + '*\\n' + Object.entries(res).map(([k,v]) => '• ' + k + ': ' + (v==='taken'?'❌ taken':'✅ available')).join('\\n')); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'ssweb': { aliases: ['screenshot', 'shot'], desc: 'Website screenshot', guide: '{prefix}ssweb <url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('📸 Use: \`ssweb https://example.com\`');\n    try { const r = await axios.get(\`\${API}/ported/screenshot\`, { params: { url }, timeout: 30000 }); if (r.data?.imageUrl && sendImage) sendImage(r.data.imageUrl); else reply('📸 ' + (r.data?.imageUrl||'')); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
};

let n = 0;
for (const [name, c] of Object.entries(cmds)) {
  fs.writeFileSync(path.join(BASE, name + '.js'), TMPL(name, c.aliases, c.desc, c.guide, c.body));
  n++;
}
console.log('Created', n, 'commands');
