// Bulk command generator for Amazing-Botv2.
// Creates command modules in the bot's format: { config: {...}, onStart({...}) }.
const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, '..', 'src', 'commands', 'general');
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true });

const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

const tmpl = (name, aliases, cat, desc, guide, body) => `import axios from 'axios';
const API = process.env.BROKEN_API || '${API}';

export default {
  config: { name: '${name}', aliases: [${aliases.map(a => `'${a}'`).join(', ')}], author: 'Broken_vzn', version: '1.0', shortDescription: '${desc}', category: '${cat}', coolDown: 3, role: 0, guide: { en: '${guide}' } },
  async onStart({ message, args, reply, sendImage, sendVideo }) {
${body}
  },
};
`;

// ---------- AI commands ----------
const aiCmds = {
  'chatbot': { aliases: ['chat', 'askai'], cat: 'ai', desc: 'Chat with the AI', guide: '{prefix}chatbot <question>', body: `if (!args[0]) return reply('💬 Ask me: \`chatbot <question>\`');\n    try { const r = await axios.get(\`\${API}/ai/chat\`, { params: { q: args.join(' '), provider: 'pollinations' }, timeout: 60000 }); if (!r.data?.ok || !r.data?.answer) return reply('⚠️ AI unavailable.'); reply('🤖 ' + r.data.answer); } catch (e) { reply('❌ ' + e.message); }` },
  'gpt': { aliases: ['gpt3'], cat: 'ai', desc: 'Chat with GPT', guide: '{prefix}gpt <question>', body: `if (!args[0]) return reply('🤖 Ask: \`gpt <question>\`');\n    try { const r = await axios.get(\`\${API}/ai/chat\`, { params: { q: args.join(' '), provider: 'gpt' }, timeout: 60000 }); reply('🤖 GPT: ' + (r.data?.answer || 'no reply')); } catch (e) { reply('❌ ' + e.message); }` },
  'gemini': { aliases: ['gem'], cat: 'ai', desc: 'Chat with Gemini', guide: '{prefix}gemini <question>', body: `if (!args[0]) return reply('✨ Ask: \`gemini <question>\`');\n    try { const r = await axios.get(\`\${API}/ai/chat\`, { params: { q: args.join(' '), provider: 'gemini' }, timeout: 60000 }); reply('✨ Gemini: ' + (r.data?.answer || 'no reply')); } catch (e) { reply('❌ ' + e.message); }` },
  'deepseek': { aliases: ['deep'], cat: 'ai', desc: 'Chat with DeepSeek', guide: '{prefix}deepseek <question>', body: `if (!args[0]) return reply('🧠 Ask: \`deepseek <question>\`');\n    try { const r = await axios.get(\`\${API}/ai/chat\`, { params: { q: args.join(' '), provider: 'deepseek' }, timeout: 60000 }); reply('🧠 DeepSeek: ' + (r.data?.answer || 'no reply')); } catch (e) { reply('❌ ' + e.message); }` },
  'claude': { aliases: [], cat: 'ai', desc: 'Chat with Claude', guide: '{prefix}claude <question>', body: `if (!args[0]) return reply('🤖 Ask: \`claude <question>\`');\n    try { const r = await axios.get(\`\${API}/ai/chat\`, { params: { q: args.join(' '), provider: 'claude' }, timeout: 60000 }); reply('🤖 Claude: ' + (r.data?.answer || 'no reply')); } catch (e) { reply('❌ ' + e.message); }` },
  'groq': { aliases: [], cat: 'ai', desc: 'Chat with Groq', guide: '{prefix}groq <question>', body: `if (!args[0]) return reply('⚡ Ask: \`groq <question>\`');\n    try { const r = await axios.get(\`\${API}/ai/chat\`, { params: { q: args.join(' '), provider: 'groq' }, timeout: 60000 }); reply('⚡ Groq: ' + (r.data?.answer || 'no reply')); } catch (e) { reply('❌ ' + e.message); }` },
  'dalle': { aliases: ['imagine'], cat: 'ai', desc: 'Generate AI image', guide: '{prefix}dalle <prompt>', body: `if (!args[0]) return reply('🎨 Describe: \`dalle a red dragon\`');\n    try { const r = await axios.get(\`\${API}/ai/image\`, { params: { prompt: args.join(' ') }, timeout: 90000 }); if (!r.data?.imageUrl) return reply('⚠️ Could not generate.'); if (sendImage) sendImage(r.data.imageUrl, { caption: '🎨 ' + args.join(' ') }); else reply('🖼️ ' + r.data.imageUrl); } catch (e) { reply('❌ ' + e.message); }` },
};

// ---------- Download commands ----------
const dlCmds = {
  'tiktok': { aliases: ['tt'], cat: 'downloader', desc: 'Download TikTok video', guide: '{prefix}tiktok <url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('🔗 \`tiktok <video-url>\`');\n    try { const r = await axios.get(\`\${API}/social/video\`, { params: { url }, timeout: 90000 }); if (!r.data?.streamUrl) return reply('⚠️ Could not download.'); if (sendVideo) sendVideo(r.data.streamUrl, { caption: '⬇️ ' + (r.data.title || 'TikTok') }); else reply('🔗 ' + r.data.streamUrl); } catch (e) { reply('❌ ' + e.message); }` },
  'instagram': { aliases: ['ig'], cat: 'downloader', desc: 'Download Instagram post/reel', guide: '{prefix}instagram <url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('🔗 \`instagram <url>\`');\n    try { const r = await axios.get(\`\${API}/social/video\`, { params: { url }, timeout: 90000 }); if (!r.data?.streamUrl) return reply('⚠️ Could not download.'); if (sendVideo) sendVideo(r.data.streamUrl, { caption: '⬇️ Instagram' }); else reply('🔗 ' + r.data.streamUrl); } catch (e) { reply('❌ ' + e.message); }` },
  'facebook': { aliases: ['fb'], cat: 'downloader', desc: 'Download Facebook video', guide: '{prefix}facebook <url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('🔗 \`facebook <url>\`');\n    try { const r = await axios.get(\`\${API}/social/video\`, { params: { url }, timeout: 90000 }); if (!r.data?.streamUrl) return reply('⚠️ Could not download.'); if (sendVideo) sendVideo(r.data.streamUrl, { caption: '⬇️ Facebook' }); else reply('🔗 ' + r.data.streamUrl); } catch (e) { reply('❌ ' + e.message); }` },
  'twitter': { aliases: ['x'], cat: 'downloader', desc: 'Download Twitter/X video', guide: '{prefix}twitter <url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('🔗 \`twitter <url>\`');\n    try { const r = await axios.get(\`\${API}/social/video\`, { params: { url }, timeout: 90000 }); if (!r.data?.streamUrl) return reply('⚠️ Could not download.'); if (sendVideo) sendVideo(r.data.streamUrl, { caption: '⬇️ Twitter' }); else reply('🔗 ' + r.data.streamUrl); } catch (e) { reply('❌ ' + e.message); }` },
  'mediafire': { aliases: ['mf'], cat: 'downloader', desc: 'Get MediaFire direct link', guide: '{prefix}mediafire <url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('🔗 \`mediafire <url>\`');\n    try { const r = await axios.get(\`\${API}/download/mediafire\`, { params: { url }, timeout: 60000 }); if (!r.data?.directUrl) return reply('⚠️ Could not extract link.'); reply('📦 *MediaFire*\n📄 ' + (r.data.fileName || 'file') + '\n🔗 ' + r.data.directUrl); } catch (e) { reply('❌ ' + e.message); }` },
  'apk': { aliases: ['apkdl'], cat: 'downloader', desc: 'Download APK by package/name', guide: '{prefix}apk <app name or package>', body: `if (!args[0]) return reply('📦 \`apk telegram\` or \`apk org.telegram.messenger\`');\n    try { let pkg = args[0]; if (!pkg.includes('.')) { const s = await axios.get(\`\${API}/apk/search\`, { params: { q: pkg }, timeout: 30000 }); pkg = s.data?.packageName || pkg; } const r = await axios.get(\`\${API}/apk\`, { params: { package: pkg }, timeout: 60000 }); reply('📦 *APK*\n📄 ' + (r.data.fileName || pkg) + ' (' + ((r.data.size||0)/1048576).toFixed(1) + 'MB)\n🔗 ' + r.data.downloadUrl); } catch (e) { reply('❌ ' + e.message); }` },
};

// ---------- Tool commands ----------
const toolCmds = {
  'weather': { aliases: ['wth'], cat: 'utility', desc: 'Weather for a city', guide: '{prefix}weather <city>', body: `if (!args[0]) return reply('🌤️ \`weather london\`');\n    try { const r = await axios.get(\`\${API}/tools/weather\`, { params: { city: args.join(' ') }, timeout: 30000 }); reply('🌤️ ' + (r.data.location || args[0]) + ' - ' + (r.data.tempC ?? '?') + '°C'); } catch (e) { reply('❌ ' + e.message); }` },
  'define': { aliases: ['dictionary', 'meaning'], cat: 'utility', desc: 'Word meaning', guide: '{prefix}define <word>', body: `if (!args[0]) return reply('📖 \`define code\`');\n    try { const r = await axios.get(\`\${API}/dictionary\`, { params: { word: args[0] }, timeout: 30000 }); const m = r.data; let s = '📖 *' + m.word + '*'; (m.meanings||[]).slice(0,2).forEach(x => { s += '\\n_(' + x.partOfSpeech + ')_'; (x.definitions||[]).slice(0,2).forEach(d => s += '\\n• ' + d); }); reply(s); } catch (e) { reply('❌ Word not found.'); }` },
  'fact': { aliases: ['facts'], cat: 'fun', desc: 'Random fact', guide: '{prefix}fact', body: `try { const r = await axios.get(\`\${API}/facts/random\`, { timeout: 20000 }); reply('💡 ' + r.data.fact); } catch (e) { reply('❌ ' + e.message); }` },
  'jokes': { aliases: ['joke', 'meme'], cat: 'fun', desc: 'Random joke', guide: '{prefix}jokes', body: `try { const r = await axios.get(\`\${API}/jokes/random\`, { timeout: 20000 }); const j = Array.isArray(r.data?.jokes) ? r.data.jokes[0] : r.data?.joke; reply('😂 ' + (typeof j === 'string' ? j : (j?.joke || j?.question || 'no joke'))); } catch (e) { reply('❌ ' + e.message); }` },
  'quotes': { aliases: ['quote'], cat: 'fun', desc: 'Random quote', guide: '{prefix}quotes', body: `try { const r = await axios.get(\`\${API}/tools/quote\`, { timeout: 20000 }); reply('💬 \"' + r.data.quote + '\"\\n— ' + (r.data.author || '')); } catch (e) { reply('❌ ' + e.message); }` },
  'trivia': { aliases: ['quiz'], cat: 'fun', desc: 'Random trivia question', guide: '{prefix}trivia', body: `try { const r = await axios.get(\`\${API}/quiz/trivia\`, { params: { amount: 1 }, timeout: 30000 }); const q = r.data.questions?.[0]; if (!q) return reply('⚠️ No trivia.'); reply('❓ ' + q.question + '\\n✅ ' + q.correctAnswer); } catch (e) { reply('❌ ' + e.message); }` },
  'translate': { aliases: ['tr'], cat: 'utility', desc: 'Translate text', guide: '{prefix}translate <text> | <to>', body: `if (!args[0]) return reply('🌍 \`translate hello | fr\`');\n    const txt = args.join(' ').split('|')[0].trim(); const to = (args.join(' ').split('|')[1]||'en').trim();\n    try { const r = await axios.get(\`\${API}/translate\`, { params: { text: txt, to }, timeout: 30000 }); reply('🌍 ' + (r.data.translation || r.data.text || 'done')); } catch (e) { reply('❌ ' + e.message); }` },
  'qrcode': { aliases: ['qr'], cat: 'utility', desc: 'Generate QR code', guide: '{prefix}qrcode <text>', body: `if (!args[0]) return reply('🔳 \`qrcode hello\`');\n    try { const r = await axios.get(\`\${API}/tools/qr\`, { params: { data: args.join(' '), size: 400 }, timeout: 30000 }); if (sendImage) sendImage(r.data.qrUrl); else reply('🔗 ' + r.data.qrUrl); } catch (e) { reply('❌ ' + e.message); }` },
  'shorten': { aliases: ['tinyurl'], cat: 'utility', desc: 'Shorten a URL', guide: '{prefix}shorten <url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('🔗 \`shorten <url>\`');\n    try { const r = await axios.get(\`\${API}/tools/shorten\`, { params: { url }, timeout: 30000 }); reply('🔗 ' + (r.data.shortUrl || r.data.url)); } catch (e) { reply('❌ ' + e.message); }` },
  'genpass': { aliases: ['password'], cat: 'utility', desc: 'Generate a strong password', guide: '{prefix}genpass <length>', body: `const len = Number(args[0]) || 16;\n    try { const r = await axios.get(\`\${API}/tools/password\`, { params: { length: len }, timeout: 20000 }); reply('🔐 Password: \`' + (r.data.password || r.data) + '\`'); } catch (e) { reply('❌ ' + e.message); }` },
  'spotify': { aliases: ['song'], cat: 'downloader', desc: 'Search/download song (Spotify)', guide: '{prefix}spotify <song>', body: `if (!args[0]) return reply('🎵 \`spotify <song name>\`');\n    try { const r = await axios.get(\`\${API}/yt/search\`, { params: { q: args.join(' ') + ' audio', limit: 1 }, timeout: 30000 }); const v = r.data?.results?.[0] || r.data?.videos?.[0]; reply('🎵 ' + (v?.title || 'song') + '\\n🔗 ' + (v?.url || v?.id)); } catch (e) { reply('❌ ' + e.message); }` },
  'yts': { aliases: ['youtube', 'ytsearch'], cat: 'search', desc: 'Search YouTube', guide: '{prefix}yts <query>', body: `if (!args[0]) return reply('🔍 \`yts <query>\`');\n    try { const r = await axios.get(\`\${API}/yt/search\`, { params: { q: args.join(' '), limit: 5 }, timeout: 30000 }); const vs = r.data?.results || r.data?.videos || []; if (!vs.length) return reply('No results.'); reply('🎥 *Results:*\\n' + vs.slice(0,5).map((v,i) => (i+1) + '. ' + v.title).join('\\n')); } catch (e) { reply('❌ ' + e.message); }` },
  'browse': { aliases: ['web'], cat: 'tools', desc: 'Fetch a webpage as text', guide: '{prefix}browse <url>', body: `const url = args.find(a => /^https?:\\/\\//i.test(a)); if (!url) return reply('🌐 \`browse <url>\`');\n    try { const r = await axios.get(url, { timeout: 30000 }); reply('🌐 ' + String(r.data).replace(/<[^>]+>/g,' ').replace(/\\s+/g,' ').slice(0, 1500)); } catch (e) { reply('❌ ' + e.message); }` },
};

// ---------- Sports commands ----------
const leagues = { epl: 'Premier League', l1: 'Ligue 1', ll: 'La Liga', bl: 'Bundesliga', sa: 'Serie A', cl: 'Champions League', el: 'Europa League', wc: 'World Cup', efl: 'EFL' };
const sportCmds = {};
for (const [code, name] of Object.entries(leagues)) {
  sportCmds[code + 'matches'] = { aliases: [], cat: 'sports', desc: name + ' matches', guide: `{prefix}${code}matches`, body: `try { const r = await axios.get(\`\${API}/sports/leagues\`, { params: { league: '${code}' }, timeout: 30000 }); const ms = r.data?.matches || r.data?.data || []; if (!ms.length) return reply('No matches.'); reply('⚽ *${name}*\\n' + ms.slice(0,5).map(m => '• ' + (m.homeTeam||'') + ' vs ' + (m.awayTeam||'')).join('\\n')); } catch (e) { reply('❌ ' + e.message); }` };
  sportCmds[code + 'standings'] = { aliases: [], cat: 'sports', desc: name + ' standings', guide: `{prefix}${code}standings`, body: `try { const r = await axios.get(\`\${API}/sports/standings\`, { params: { league: '${code}' }, timeout: 30000 }); const t = r.data?.standings || r.data?.data || []; if (!t.length) return reply('No standings.'); reply('🏆 *${name} Standings*\\n' + t.slice(0,8).map((x,i) => (i+1) + '. ' + (x.team||x.name||'')).join('\\n')); } catch (e) { reply('❌ ' + e.message); }` };
}

const ALL = { ...aiCmds, ...dlCmds, ...toolCmds, ...sportCmds };
let created = 0;
for (const [name, c] of Object.entries(ALL)) {
  const file = path.join(DIR, name + '.js');
  const code = tmpl(name, c.aliases, c.cat, c.desc, c.guide, c.body);
  fs.writeFileSync(file, code);
  created++;
}
console.log('Created', created, 'commands in', DIR);
