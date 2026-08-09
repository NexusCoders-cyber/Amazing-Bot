// Rewrite scripts/cmds external-API commands to route through the BROKEN API.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CMDS = path.join(__dirname, '..', 'scripts', 'cmds');
const API = 'https://broken-api-production-31d5.up.railway.app/api';

// Map command -> { apiEndpoint, param } that exists on BROKEN API
const MAP = {
  'btcprice': { ep: '/trading/crypto', param: 'symbol', val: 'BTCUSDT', out: 'price' },
  'ethprice': { ep: '/trading/crypto', param: 'symbol', val: 'ETHUSDT', out: 'price' },
  'cryptoprice': { ep: '/trading/crypto/prices', param: 'symbols', out: 'prices' },
  'define': { ep: '/dictionary', param: 'word', out: 'meanings' },
  'translate': { ep: '/translate', param: 'text', to: 'to' },
  'translate2': { ep: '/translate', param: 'text', to: 'to' },
  'translate3': { ep: '/translate', param: 'text', to: 'to' },
  'trivia': { ep: '/quiz/trivia', param: 'amount', out: 'questions' },
  'triviamaster': { ep: '/quiz/trivia', param: 'amount', out: 'questions' },
  'weather': { ep: '/tools/weather', param: 'city', out: 'tempC' },
  'weather2': { ep: '/tools/weather', param: 'city', out: 'tempC' },
  'weather3': { ep: '/tools/weather', param: 'city', out: 'tempC' },
  'quote': { ep: '/tools/quote', out: 'quote' },
  'fact': { ep: '/facts/random', out: 'fact' },
  'joke': { ep: '/jokes/random', out: 'jokes' },
  'imagegen': { ep: '/ai/image', param: 'prompt', out: 'imageUrl' },
  'qrcode': { ep: '/tools/qr', param: 'data', out: 'qrUrl' },
  'tiktok2': { ep: '/social/video', param: 'url', out: 'streamUrl' },
  'tiktokdl': { ep: '/social/video', param: 'url', out: 'streamUrl' },
  'instadl': { ep: '/social/video', param: 'url', out: 'streamUrl' },
  'twitter2': { ep: '/social/video', param: 'url', out: 'streamUrl' },
  'twitterdl': { ep: '/social/video', param: 'url', out: 'streamUrl' },
  'facebook2': { ep: '/social/video', param: 'url', out: 'streamUrl' },
  'apkdl': { ep: '/apk', param: 'package', out: 'downloadUrl' },
  'mediafire2': { ep: '/download/mediafire', param: 'url', out: 'directUrl' },
  'mediafiredl': { ep: '/download/mediafire', param: 'url', out: 'directUrl' },
  'wiki': { ep: '/wikipedia', param: 'query', out: 'summary' },
  'currency2': { ep: '/tools/currency', out: 'result' },
  'animequote': { ep: '/quotes/random', out: 'quote' },
  'catfact': { ep: '/facts/random', out: 'fact' },
  'lyrics2': { ep: '/tools/lyrics', out: 'lyrics' },
  'meme': { ep: '/tools/memes', out: 'memes' },
  'color': { ep: '/color', out: 'hex' },
};

// Simple reply-body injection: find the axios.get call and replace URL with BROKEN API
function rewrite(file, name, m) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('broken-api')) return; // already done
  const ep = m.ep;
  // Build a new axios.get line targeting the API
  // We'll replace the first occurrence of axios.get(`...` or axios.get("...") with our API call
  const getRe = /axios\.get\(\s*[`'"][^`'"]+[`'"]([^)]*)\)/;
  const match = s.match(getRe);
  if (!match) return;
  const paramsArg = match[1] || '';
  let newCall;
  if (m.param) {
    // try to find how the command passes the param value (args[0], url var, etc.)
    newCall = `axios.get(\`${API}${ep}\`, { params: { ${m.param}: args[0] || ''${m.to ? ', ' + m.to + ": 'en'" : ''} }, timeout: 60000 })`;
  } else if (m.val) {
    newCall = `axios.get(\`${API}${ep}\`, { params: { ${m.param}: '${m.val}' }, timeout: 30000 })`;
  } else {
    newCall = `axios.get(\`${API}${ep}\`, { timeout: 30000 })`;
  }
  s = s.replace(match[0], newCall);
  // ensure axios import
  if (!s.includes("import axios") && !s.includes("require('axios')")) {
    s = "import axios from 'axios';\n" + s;
  }
  fs.writeFileSync(file, s);
  return true;
}

let n = 0;
for (const [name, m] of Object.entries(MAP)) {
  const file = path.join(CMDS, name + '.js');
  if (fs.existsSync(file)) {
    if (rewrite(file, name, m)) { console.log('rewrote', name); n++; }
  }
}
console.log('Rewrote', n, 'commands to use BROKEN API');
