import axios from 'axios';

const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

const PLATFORMS = ['tiktok', 'instagram', 'facebook', 'youtube', 'twitter', 'yt'];

export default {
  config: {
    name: 'download',
    aliases: ['dl', 'video', 'get'],
    author: 'Broken_vzn',
    version: '1.0',
    shortDescription: 'Download videos from TikTok, Instagram, YouTube, Facebook & more',
    category: 'downloader',
    coolDown: 5,
    role: 0,
    guide: { en: '{prefix}download <video-url> — get direct download link' },
  },
  async onStart({ message, args, reply, sendVideo, sendMessage }) {
    const url = args.find((a) => /^https?:\/\//i.test(a));
    if (!url) return reply('🔗 Send a video link to download:\n`download https://www.tiktok.com/@user/video/123`\n\nWorks with: TikTok, Instagram, Facebook, YouTube, Twitter/X');
    const thinking = await reply('⬇️ Fetching video...');
    try {
      const r = await axios.get(`${API}/social/video`, { params: { url }, timeout: 90000 });
      const d = r.data;
      if (!d.ok || !d.streamUrl) return reply('⚠️ Could not get a download link for that URL.');
      const msg = `⬇️ *Video ready*\n🎬 ${d.title || 'Video'}\n❤️ ${d.like_count ?? '?'} likes · 👀 ${d.view_count ?? '?'} views\n🔗 ${d.streamUrl}`;
      if (sendVideo) {
        try { await sendVideo(d.streamUrl, { caption: msg }); }
        catch { reply(msg); }
      } else {
        await reply(msg);
      }
      if (thinking?.key) { try { await message.chat?.deleteMessages?.([thinking.key]); } catch {} }
    } catch (e) { reply('❌ Download error: ' + (e.message || 'network error')); }
  },
};
