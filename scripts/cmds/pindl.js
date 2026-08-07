import { cobaltDownload, fetchBuffer, validateUrl } from '../../src/utils/downloadHelper.js';
import axios from 'axios';

export default {
    config: {
        name: 'pindl',
        aliases: ['pinterest', 'pin'],
        author: 'Broken_vzn',
        version: '2.0',
        shortDescription: 'Download Pinterest images and videos',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}pindl <url or search>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('📌');
        if (!args.length) return reply(`Usage: ${prefix}pindl <Pinterest URL>`);

        const url = args[0];
        if (!validateUrl(url, ['pinterest.com', 'pin.it'])) {
            return reply(`❌ Provide a valid Pinterest URL.`);
        }

        await reply(`📌 Downloading Pinterest media...`);

        // Try cobalt
        const result = await cobaltDownload(url);
        if (result?.url) {
            try {
                const buf = await fetchBuffer(result.url);
                if (buf.length > 1000) {
                    const isVideo = result.url.includes('.mp4') || buf.slice(0, 4).toString() === 'ftyp';
                    if (isVideo) {
                        await reply({ video: buf, caption: `📌 *Pinterest Download* ✅` });
                    } else {
                        await reply({ image: buf, caption: `📌 *Pinterest Download* ✅` });
                    }
                    return;
                }
            } catch {}
        }

        // Fallback: try to extract image URL from Pinterest page
        try {
            const { data } = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' },
                timeout: 10000,
            });
            const imgMatch = data.match(/"origUrl"\s*:\s*"([^"]+)"/);
            if (imgMatch) {
                const imgUrl = imgMatch[1].replace(/\\u002F/g, '/');
                const buf = await fetchBuffer(imgUrl);
                await reply({ image: buf, caption: `📌 *Pinterest Download* ✅` });
                return;
            }
        } catch {}

        reply(`❌ Failed. Check URL and try again.`);
    },
};
