import axios from 'axios';
const API = process.env.BROKEN_API || 'https://broken-api-production-31d5.up.railway.app/api';
export default {
  config: { name: 'imgur', aliases: ['upimg'], author: 'Broken_vzn', version: '1.0', shortDescription: 'Upload an image', category: 'downloader', coolDown: 3, role: 0, guide: { en: '{prefix}imgur (reply to image)' } },
  async onStart({ args, reply, sendImage, sendVideo, message }) {
const img = message?.message?.imageMessage; if (!img) return reply('Reply to an image to upload.');
    reply('🖼️ Image upload needs an upload service key; try `pixabay` to search images instead.');
  },
};
