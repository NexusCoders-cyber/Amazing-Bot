import { cobaltDownload, fetchBuffer, validateUrl } from '../../src/utils/downloadHelper.js';
import axios from 'axios';

export default {
    config: {
        name: 'instadl',
        aliases: ['igdl', 'ig', 'instagram'],
        author: 'Broken_vzn',
        version: '2.0',
        shortDescription: 'Download Instagram posts, reels, stories',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}instadl <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('📸');
        if (!args.length) return reply(`Usage: ${prefix}instadl <Instagram URL>`);

        const url = args[0];
        if (!validateUrl(url, ['instagram.com', 'instagr.am'])) {
            return reply(`❌ Provide a valid Instagram URL.`);
        }

        await reply(`📸 Downloading Instagram media...`);

        // Try cobalt
        const result = await cobaltDownload(url);
        if (result?.url) {
            try {
                const buf = await fetchBuffer(result.url);
                if (buf.length > 1000) {
                    // Check if video or image
                    const isVideo = result.url.includes('video') || buf[0] === 0x00 || result.url.includes('.mp4');
                    if (isVideo) {
                        await reply({ video: buf, caption: `📸 *Instagram Download* ✅` });
                    } else {
                        await reply({ image: buf, caption: `📸 *Instagram Download* ✅` });
                    }
                    return;
                }
            } catch {}
        }

        // Fallback: tryigram API
        try {
            const shortcode = url.match(/\/p\/([A-Za-z0-9_-]+)/)?.[1] || url.match(/\/reel\/([A-Za-z0-9_-]+)/)?.[1];
            if (shortcode) {
                const { data } = await axios.get(`https://api.veegee.xyz/api/instagram?url=${encodeURIComponent(url)}`, { timeout: 15000 });
                if (data?.success && data.data?.length) {
                    for (const item of data.data.slice(0, 5)) {
                        const buf = await fetchBuffer(item.url);
                        if (item.type === 'video') {
                            await reply({ video: buf });
                        } else {
                            await reply({ image: buf });
                        }
                    }
                    return;
                }
            }
        } catch {}

        reply(`❌ Failed to download. URL might be private or unsupported.`);
    },
};
