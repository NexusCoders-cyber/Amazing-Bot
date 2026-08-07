import { cobaltDownload, fetchBuffer, validateUrl } from '../../src/utils/downloadHelper.js';
import axios from 'axios';

export default {
    config: {
        name: 'ytmp3',
        aliases: ['yta', 'ytaudio', 'ytaudiodl'],
        author: 'Broken_vzn',
        version: '2.0',
        shortDescription: 'Download YouTube audio as MP3',
        category: 'downloader',
        coolDown: 15,
        role: 0,
        guide: { en: '{prefix}ytmp3 <url or search>' },
    },

    async onStart({ args, reply, prefix, React }) {
        React('🎵');
        if (!args.length) return reply(`Usage: ${prefix}ytmp3 <YouTube URL or search>`);

        const query = args.join(' ');
        let url = query;

        // If not a URL, search for it
        if (!url.includes('youtu')) {
            try {
                const { data } = await axios.get(`https://api.vevioz.com/api/button/mp3/${encodeURIComponent(query)}`, { timeout: 10000 });
                // This API is unreliable, try cobalt search
            } catch {}
            return reply(`Provide a YouTube URL.\nUsage: ${prefix}ytmp3 https://youtube.com/watch?v=...`);
        }

        await reply(`🎵 Downloading audio...`);

        // Try cobalt with audio mode
        const result = await cobaltDownload(url, { audio: true });
        if (result?.url) {
            try {
                const buf = await fetchBuffer(result.url);
                if (buf.length > 1000) {
                    await reply({ audio: buf, mimetype: 'audio/mpeg', ptt: false, caption: `🎵 *YouTube Audio* ✅` });
                    return;
                }
            } catch {}
        }

        // Try alternative: use yt-dlp if available
        try {
            const { execSync } = await import('child_process');
            const outPath = `/tmp/yt_${Date.now()}.mp3`;
            execSync(`yt-dlp -x --audio-format mp3 -o "${outPath}" "${url}" --no-playlist`, { timeout: 120000 });
            const fs = await import('fs');
            if (fs.existsSync(outPath)) {
                const buf = fs.readFileSync(outPath);
                await reply({ audio: buf, mimetype: 'audio/mpeg', ptt: false, caption: `🎵 *YouTube Audio* ✅` });
                fs.unlinkSync(outPath);
                return;
            }
        } catch {}

        reply(`❌ Failed. Check URL and try again.`);
    },
};
