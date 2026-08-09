import axios from 'axios';

const API = process.env.BROKEN_API || 'https://api.brokenvzn.de5.net/api';

const ACTION_ALIASES = {
  hold: 'handhold', hi: 'wave', animehug: 'hug', animekiss: 'kiss',
  animeblush: 'blush', animecry: 'cry', animatedance: 'dance',
  animehappy: 'happy', animewink: 'wink', animepat: 'pat',
};

function normalizeAction(action = '') {
  const clean = String(action || '').toLowerCase().trim();
  return ACTION_ALIASES[clean] || clean;
}

// Use the BROKEN API's /api/gif/<action> endpoints (real anime reaction GIFs)
async function getMediaUrl(action) {
  try {
    const { data } = await axios.get(`${API}/gif/${encodeURIComponent(action)}`, { timeout: 25000 });
    return data?.url || data?.image || '';
  } catch (e) {
    // fallback: /api/gif/anime?category=
    try {
      const { data } = await axios.get(`${API}/gif/anime`, { params: { category: action }, timeout: 25000 });
      return data?.url || data?.image || '';
    } catch { return ''; }
  }
}

export async function runAnimeAction({ sock, message, from, action }) {
  const normalized = normalizeAction(action);

  const mediaUrl = await getMediaUrl(normalized);
  if (!mediaUrl) throw new Error('No media URL returned');

  const senderName = message?.pushName || 'Someone';
  const target = message?.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const caption = target
    ? `${senderName} ${normalized}s @${target.split('@')[0]}!`
    : `${senderName} used ${normalized}!`;

  const isGif = /\.(gif|mp4|webm|mov|mkv)(\?|$)/i.test(mediaUrl);

  if (isGif) {
    // Send as a GIF (animated) so WhatsApp plays it as a GIF sticker
    await sock.sendMessage(from, {
      video: { url: mediaUrl },
      gifPlayback: true,
      caption,
    }, { quoted: message });
    return;
  }

  await sock.sendMessage(from, { image: { url: mediaUrl }, caption }, { quoted: message });
}
