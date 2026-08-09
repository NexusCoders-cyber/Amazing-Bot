// Generator batch 3: MORE DOWNLOADERS + TOOLS.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE = path.join(__dirname, '..', 'src', 'commands', 'general');

const TMPL = (name, aliases, cat, desc, guide, body) => `import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: '${name}', aliases: [${aliases.map(a => `'${a}'`).join(', ')}], author: 'Broken_vzn', version: '1.0', shortDescription: '${desc}', category: '${cat}', coolDown: 3, role: 0, guide: { en: '${guide}' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
${body}
  },
};
`;

const cmds = {
  // ---------- More downloaders ----------
  'ytmp3': { aliases: ['tomp3', 'audio', 'songdl'], cat: 'downloader', desc: 'Get YouTube audio/mp3', guide: '{prefix}ytmp3 <yt-url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('🎵 Use: \`ytmp3 <yt-url>\`');\n    try { const r = await axios.get(\`\${API}/dl/video\`, { params: { url }, timeout: 90000 }); const v = r.data; reply('🎵 ' + (v.title||'audio') + '\\n🔗 ' + (v.formats?.find(f=>!f.hasVideo)?.url || v.streamUrl || '')); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'ytdl': { aliases: ['yt', 'youtube'], cat: 'downloader', desc: 'Download YouTube video', guide: '{prefix}ytdl <yt-url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('▶️ Use: \`ytdl <yt-url>\`');\n    try { const r = await axios.get(\`\${API}/dl/video\`, { params: { url }, timeout: 90000 }); const v = r.data; if (sendVideo && v.streamUrl) sendVideo(v.streamUrl, { caption: '⬇️ ' + (v.title||'video') }); else reply('▶️ ' + (v.streamUrl||'')); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'capcut': { aliases: [], cat: 'downloader', desc: 'Download CapCut template', guide: '{prefix}capcut <url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('✂️ Use: \`capcut <url>\`');\n    try { const r = await axios.get(\`\${API}/dl/video\`, { params: { url }, timeout: 90000 }); const v = r.data; if (sendVideo && v.streamUrl) sendVideo(v.streamUrl); else reply('✂️ ' + (v.streamUrl||'')); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'pixabay': { aliases: ['px'], cat: 'downloader', desc: 'Search Pixabay images', guide: '{prefix}pixabay <query>', body: `if (!args[0]) return reply('🖼️ Use: \`pixabay nature\`');\n    try { const r = await axios.get(\`\${API}/images/search\`, { params: { q: args.join(' '), count: 5 }, timeout: 30000 }); const imgs = r.data?.images || []; if (!imgs.length) return reply('No results.'); if (sendImage) imgs.slice(0,3).forEach(i => sendImage(i.url)); else reply(imgs[0]?.url); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'imgur': { aliases: ['upimg'], cat: 'downloader', desc: 'Upload an image', guide: '{prefix}imgur (reply to image)', body: `const img = message?.message?.imageMessage; if (!img) return reply('Reply to an image to upload.');\n    reply('🖼️ Image upload needs an upload service key; try \`pixabay\` to search images instead.');` },
  'instagramaudio': { aliases: ['igaudio'], cat: 'downloader', desc: 'Get Instagram reel audio', guide: '{prefix}igaudio <url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('🎵 Use: \`igaudio <ig-url>\`');\n    try { const r = await axios.get(\`\${API}/social/video\`, { params: { url }, timeout: 90000 }); reply('🎵 ' + (r.data?.title||'audio') + '\\n🔗 ' + (r.data?.streamUrl||'')); } catch (e) { reply('❌ ' + (e.message||'error')); }` },

  // ---------- More tools ----------
  'lyrics': { aliases: ['songlyrics'], cat: 'search', desc: 'Get song lyrics', guide: '{prefix}lyrics <song>', body: `if (!args[0]) return reply('🎤 Use: \`lyrics <song name>\`');\n    try { const r = await axios.get(\`\${API}/tools/lyrics\`, { params: { title: args.join(' ') }, timeout: 30000 }); reply('🎤 *' + (r.data?.title||'Lyrics') + '*\\n' + String(r.data?.lyrics||'Not found').slice(0,1500)); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'imdb': { aliases: ['movieinfo'], cat: 'search', desc: 'Search IMDb movie info', guide: '{prefix}imdb <movie>', body: `if (!args[0]) return reply('🎬 Use: \`imdb inception\`');\n    try { const r = await axios.get(\`\${API}/search?q=\${encodeURIComponent(args.join(' '))}&type=movie&per_page=3\`, { timeout: 30000 }); const ms = r.data?.results||[]; if (!ms.length) return reply('No results.'); reply('🎬 *' + ms[0].title + '*\\n📅 ' + (ms[0].year||'') + '\\n⭐ ' + (ms[0].rating||'') + '\\n' + (ms[0].description||'').slice(0,200)); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'tinyurl': { aliases: ['shorten'], cat: 'utility', desc: 'Shorten a URL', guide: '{prefix}tinyurl <url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('🔗 Use: \`tinyurl <url>\`');\n    try { const r = await axios.get(\`\${API}/tools/shorten\`, { params: { url }, timeout: 30000 }); reply('🔗 ' + (r.data?.shortUrl || r.data?.url)); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'recipe': { aliases: ['cook'], cat: 'tools', desc: 'Search a recipe', guide: '{prefix}recipe <dish>', body: `if (!args[0]) return reply('🍳 Use: \`recipe pasta\`');\n    try { const r = await axios.get(\`\${API}/search?q=\${encodeURIComponent(args.join(' '))}&per_page=3\`, { timeout: 30000 }); reply('🍳 Searched: ' + args.join(' ')); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'memes': { aliases: ['meme'], cat: 'fun', desc: 'Get a meme', guide: '{prefix}memes', body: `try { const r = await axios.get(\`\${API}/tools/memes\`, { timeout: 30000 }); const m = r.data?.memes?.[0]; if (m?.url && sendImage) sendImage(m.url, { caption: m.name||'meme' }); else reply('😂 Meme endpoint'); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'wallpaper': { aliases: ['wp'], cat: 'utility', desc: 'Get a wallpaper', guide: '{prefix}wallpaper <query>', body: `const q = args.join(' ')||'nature';\n    try { const r = await axios.get(\`\${API}/images/search\`, { params: { q, count: 5 }, timeout: 30000 }); const imgs = r.data?.images||[]; if (imgs[0]?.url && sendImage) sendImage(imgs[0].url); else reply(imgs[0]?.url||'none'); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'calculate': { aliases: ['calc'], cat: 'tools', desc: 'Calculate an expression', guide: '{prefix}calculate 2+2', body: `if (!args[0]) return reply('🧮 Use: \`calculate 2+2*3\`');\n    try { const expr = args.join(' ').replace(/[^0-9+\\-*/.() ]/g,''); const val = Function('return (' + expr + ')')(); reply('🧮 ' + expr + ' = ' + val); } catch (e) { reply('❌ Invalid expression'); }` },
  'translate2': { aliases: ['tr2'], cat: 'utility', desc: 'Translate text (alt)', guide: '{prefix}translate2 <text>|<to>', body: `if (!args[0]) return reply('🌍 Use: \`translate2 hello|fr\`');\n    const parts = args.join(' ').split('|'); const txt = parts[0].trim(); const to = (parts[1]||'en').trim();\n    try { const r = await axios.get(\`\${API}/translate\`, { params: { text: txt, to }, timeout: 30000 }); reply('🌍 ' + (r.data?.translation || r.data?.text || 'done')); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'trivia': { aliases: ['quiz'], cat: 'fun', desc: 'Random trivia', guide: '{prefix}trivia', body: `try { const r = await axios.get(\`\${API}/quiz/trivia\`, { params: { amount: 1 }, timeout: 30000 }); const q = r.data?.questions?.[0]; if (!q) return reply('⚠️ No trivia.'); reply('❓ ' + q.question + '\\n✅ ' + q.correctAnswer); } catch (e) { reply('❌ ' + (e.message||'error')); }` },
  'quran': { aliases: [], cat: 'religion', desc: 'Quran (coming soon)', guide: '{prefix}quran', body: `reply('📖 Quran API coming soon.');` },
  'bible': { aliases: [], cat: 'religion', desc: 'Bible verse (coming soon)', guide: '{prefix}bible', body: `reply('📖 Bible API coming soon.');` },
};

let n = 0;
for (const [name, c] of Object.entries(cmds)) {
  fs.writeFileSync(path.join(BASE, name + '.js'), TMPL(name, c.aliases, c.cat, c.desc, c.guide, c.body));
  n++;
}
console.log('Created', n, 'more commands');
