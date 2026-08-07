import axios from 'axios';

async function cobaltDownload(url, opts = {}) {
    // Try cobalt v7 API
    try {
        const { data } = await axios.post('https://api.cobalt.tools/api/json', {
            url,
            vCodec: 'h264',
            vQuality: '720',
            isAudioOnly: opts.audio || false,
        }, {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            timeout: 30000,
        });
        if (data?.url) return data.url;
    } catch {}

    // Try cobalt v10 API
    try {
        const { data } = await axios.post('https://api.cobalt.tools/', {
            url,
            videoQuality: '720',
            audioFormat: opts.audio ? 'mp3' : undefined,
        }, {
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            timeout: 30000,
        });
        if (data?.url) return data.url;
    } catch {}

    return null;
}

// TikTok downloader
export default {
    config: {
        name: 'tiktokdl',
        aliases: ['tt', 'ttdl', 'tiktok'],
        author: 'Broken_vzn',
        version: '2.0',
        shortDescription: 'Download TikTok videos (no watermark)',
        category: 'downloader',
        coolDown: 10,
        role: 0,
        guide: { en: '{prefix}tiktokdl <url>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('📱');
        if (!args.length) return reply(`Usage: ${prefix}tiktokdl <TikTok URL>`);
        const url = args[0];
        if (!url.includes('tiktok.com') && !url.includes('vm.tiktok') && !url.includes('vt.tiktok')) {
            return reply(`❌ Provide a valid TikTok URL.`);
        }

        await reply(`📱 Fetching TikTok video...`);

        // Try tikwm first (best for TikTok)
        try {
            const { data } = await axios.post('https://www.tikwm.com/api/', new URLSearchParams({ url }), {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 30000,
            });
            const playUrl = data?.data?.hdplay || data?.data?.play;
            if (playUrl) {
                const res = await axios.get(playUrl, { responseType: 'arraybuffer', timeout: 60000 });
                if (res.data.length > 1000) {
                    await reply({ video: Buffer.from(res.data), caption: `📱 *TikTok*\n📝 ${data.data.title || ''}\n👤 @${data.data.author?.unique_id || ''}` });
                    return;
                }
            }
        } catch {}

        // Fallback: cobalt
        const dlUrl = await cobaltDownload(url);
        if (dlUrl) {
            try {
                const res = await axios.get(dlUrl, { responseType: 'arraybuffer', timeout: 60000 });
                await reply({ video: Buffer.from(res.data), caption: `📱 *TikTok Download* ✅` });
                return;
            } catch {}
        }

        reply(`❌ Failed. Check URL and try again.`);
    },
};
