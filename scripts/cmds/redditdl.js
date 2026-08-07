import axios from 'axios';

export default {
    config: {
        name: 'redditdl',
        aliases: ['reddit', 'redditvideo'],
        author: 'Broken_vzn',
        version: '1.0',
        shortDescription: 'Download Reddit video/image',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}redditdl <url>' },
    },
    async onStart({ args, reply, sock, from, message }) {
        if (!args.length) return reply('Paste a Reddit post link.\nUsage: redditdl <url>');

        const url = args[0];
        if (!url.includes('reddit.com') && !url.includes('redd.it')) return reply('That doesn\'t look like a Reddit URL.');

        try {
            // Use cobalt to handle Reddit
            const { data } = await axios.post('https://api.cobalt.tools/', {
                url: url.includes('reddit.com/r/') ? url : `${url}.json`,
                filenameStyle: 'basic',
            }, {
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
                timeout: 30000,
            });

            if (data.url) {
                const { data: buffer } = await axios.get(data.url, { responseType: 'arraybuffer', timeout: 60000 });
                const isVideo = (data.contentType || '').includes('video');

                if (isVideo) {
                    await sock.sendMessage(from, { video: Buffer.from(buffer), caption: '🔴 Reddit video' }, { quoted: message });
                } else {
                    await sock.sendMessage(from, { image: Buffer.from(buffer), caption: '🔴 Reddit image' }, { quoted: message });
                }
                return;
            }

            // Fallback: fetch JSON API
            const jsonUrl = url.includes('.json') ? url : `${url.replace(/\/$/, '')}.json`;
            const { data: posts } = await axios.get(jsonUrl, {
                headers: { 'User-Agent': 'Mozilla/5.0' },
                timeout: 15000,
            });

            const post = posts?.[0]?.data?.children?.[0]?.data;
            if (!post) return reply('Could not parse the Reddit post.');

            if (post.is_video && post.media?.reddit_video?.fallback_url) {
                const { data: buffer } = await axios.get(post.media.reddit_video.fallback_url, { responseType: 'arraybuffer', timeout: 60000 });
                await sock.sendMessage(from, { video: Buffer.from(buffer), caption: `🔴 ${post.title}` }, { quoted: message });
            } else if (post.url_overridden_by_dest || post.url) {
                const imgUrl = post.url_overridden_by_dest || post.url;
                if (imgUrl.match(/\.(jpg|jpeg|png|gif|webp)/i)) {
                    const { data: buffer } = await axios.get(imgUrl, { responseType: 'arraybuffer', timeout: 30000 });
                    await sock.sendMessage(from, { image: Buffer.from(buffer), caption: `🔴 ${post.title}` }, { quoted: message });
                } else {
                    reply(`🔗 ${post.title}\n${imgUrl}`);
                }
            } else {
                reply('No media found in this post.');
            }
        } catch (err) {
            reply('Download failed. The post might be deleted or restricted.');
        }
    },
};
