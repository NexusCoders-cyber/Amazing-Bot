import axios from 'axios';

const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';

export default {
  config: {
    name: 'imagine',
    aliases: ['img', 'image', 'dalle', 'draw'],
    author: 'Broken_vzn',
    version: '1.0',
    shortDescription: 'Generate an image from text (AI)',
    category: 'ai',
    coolDown: 10,
    role: 0,
    guide: { en: '{prefix}imagine <prompt> — generate an AI image\n{prefix}imagine flux <prompt>' },
  },
  async onStart({ message, args, reply, sendImage }) {
    if (!args[0]) return reply('🎨 Describe an image:\n`imagine a red dragon in a forest`\n`imagine flux a cyberpunk city`');
    let provider = 'pollinations';
    let prompt = args.join(' ');
    if (args[0].toLowerCase() === 'flux' || args[0].toLowerCase() === 'agnes') { provider = args.shift().toLowerCase(); prompt = args.join(' '); }
    const thinking = await reply('🎨 Generating image...');
    try {
      const r = await axios.get(`${API}/ai/image`, { params: { prompt, provider }, timeout: 90000 });
      const d = r.data;
      if (!d.ok || !d.imageUrl) return reply('⚠️ ' + (d.error || 'Could not generate image.'));
      if (sendImage) await sendImage(d.imageUrl, { caption: `🎨 *${prompt}*` });
      else reply('🖼️ Image: ' + d.imageUrl);
      if (thinking?.key) { try { await message.chat?.deleteMessages?.([thinking.key]); } catch {} }
    } catch (e) { reply('❌ Image error: ' + (e.message || 'network error')); }
  },
};
