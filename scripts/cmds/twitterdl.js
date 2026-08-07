import { cobaltDownload, fetchBuffer, validateUrl } from '../../src/utils/downloadHelper.js';
import axios from 'axios';

export default {
    config: {
        name: 'twitterdl',
        aliases: ['xdl', 'tweet', 'twitter'],
        author: 'Broken_vzn',
        version: '2.0',
        shortDescription: 'Download Twitter/X videos and images',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}twitterdl <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('🐦');
        if (!args.length) return reply(`Usage: ${prefix}twitterdl <Twitter/X URL>`);
        const url = args[0];
        if (!validateUrl(url, ['twitter.com', 'x.com', 't.co'])) {
            return reply(`❌ Provide a valid Twitter/X URL.`);
        }

        await reply(`🐦 Downloading Twitter media...`);

        // Try cobalt
        const result = await cobaltDownload(url);
        if (result?.url) {
            try {
                const buf = await fetchBuffer(result.url);
                if (buf.length > 1000) {
                    const isVideo = result.url.includes('.mp4') || buf.slice(0, 4).toString() === 'ftyp';
                    if (isVideo) {
                        await reply({ video: buf, caption: `🐦 *Twitter Download* ✅` });
                    } else {
                        await reply({ image: buf, caption: `🐦 *Twitter Download* ✅` });
                    }
                    return;
                }
            } catch {}
        }

        // Fallback: vxtwitter
        try {
            const fixedUrl = url.replace('twitter.com', 'vxtwitter.com').replace('x.com', 'vxtwitter.com');
            const { data } = await axios.get(`https://api.vxtwitter.com/Status/GetTweetDetails?url=${encodeURIComponent(fixedUrl)}`, { timeout: 10000 });
            if (data?.mediaDetails?.length) {
                for (const media of data.mediaDetails.slice(0, 4)) {
                    const mediaUrl = media.video_info?.variants?.[0]?.url || media.media_url_https;
                    if (mediaUrl) {
                        const buf = await fetchBuffer(mediaUrl);
                        if (media.type === 'video' || media.type === 'animated_gif') {
                            await reply({ video: buf });
                        } else {
                            await reply({ image: buf });
                        }
                    }
                }
                return;
            }
        } catch {}

        reply(`❌ Failed. Check URL and try again.`);
    },
};
